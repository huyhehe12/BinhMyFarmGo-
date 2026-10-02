import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getProduct } from "@/data/products";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const phoneRe = /^(\+?84|0)\d{9,10}$/;
const normPhone = (p: string) => p.trim().replace(/^\+?84/, "0");

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
function datePart() {
  const d = new Date(Date.now() + 7 * 3600 * 1000);
  return d.toISOString().slice(2, 10).replace(/-/g, "");
}

/* ---------- Địa điểm công khai ---------- */
export const listLocations = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await sb
    .from("locations")
    .select("id, name, category, address, latitude, longitude, contact, maps_url, embed_url")
    .eq("verified", true)
    .order("name");
  if (error) {
    console.error(error);
    return { locations: [], error: "Không tải được danh sách địa điểm." };
  }
  return { locations: data ?? [], error: null as string | null };
});

/* ---------- Gửi yêu cầu mua ---------- */
const submitSchema = z.object({
  submissionKey: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().regex(phoneRe),
  contact: z.enum(["Điện thoại", "Zalo"]),
  delivery: z.enum(["Nhận tại vườn/điểm bán", "Giao đến địa chỉ", "Trao đổi với người bán"]),
  address: z.string().trim().max(300),
  date: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
  time: z.enum(["Sáng", "Chiều", "Linh hoạt"]),
  note: z.string().max(1000),
  items: z
    .array(z.object({ slug: z.string().max(100), quantity: z.number().int().min(1).max(1000) }))
    .min(1)
    .max(30),
});

export type SubmittedPart = {
  code: string;
  supplierName: string;
  isDemo: boolean;
  items: { name: string; quantity: number; unit: string; referencePrice: string | null }[];
  notification: string;
};

export const submitPurchaseRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.delivery === "Giao đến địa chỉ" && !data.address) throw new Error("Thiếu địa chỉ nhận hàng.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const groups = new Map<string, { slug: string; name: string; quantity: number; unit: string; referencePrice: string | null }[]>();
    for (const it of data.items) {
      const p = getProduct(it.slug);
      if (!p) throw new Error("Sản phẩm không tồn tại.");
      const list = groups.get(p.supplierId) ?? [];
      list.push({ slug: p.slug, name: p.name, quantity: it.quantity, unit: p.unit, referencePrice: p.referencePrice });
      groups.set(p.supplierId, list);
    }

    const { data: suppliers, error: sErr } = await supabaseAdmin
      .from("suppliers")
      .select("id, name, is_demo, phone, zalo_user_id, contact_verified")
      .in("id", [...groups.keys()]);
    if (sErr) throw new Error("Không lưu được yêu cầu, vui lòng thử lại.");

    const parts: SubmittedPart[] = [];
    for (const [supplierId, items] of groups) {
      const supplier = suppliers?.find((s) => s.id === supplierId);
      if (!supplier) throw new Error("Đơn vị cung cấp chưa được đăng ký.");

      // Chống gửi trùng: cùng submissionKey + nhà cung cấp trả lại mã cũ
      const { data: existing } = await supabaseAdmin
        .from("purchase_requests")
        .select("code")
        .eq("submission_key", data.submissionKey)
        .eq("supplier_id", supplierId)
        .maybeSingle();

      let code = existing?.code;
      let requestId: string | null = null;
      if (!code) {
        code = `BMFG-${datePart()}-${randomCode()}`;
        const { data: row, error } = await supabaseAdmin
          .from("purchase_requests")
          .insert({
            code,
            submission_key: data.submissionKey,
            supplier_id: supplierId,
            is_demo: supplier.is_demo,
            customer_name: data.name,
            customer_phone: normPhone(data.phone),
            contact_method: data.contact,
            delivery_method: data.delivery,
            address: data.delivery === "Giao đến địa chỉ" ? data.address : null,
            desired_date: data.date || null,
            time_slot: data.time,
            note: data.note || null,
          })
          .select("id")
          .single();
        if (error || !row) {
          console.error(error);
          throw new Error("Không lưu được yêu cầu, vui lòng thử lại.");
        }
        requestId = row.id;
        const { error: iErr } = await supabaseAdmin.from("request_items").insert(
          items.map((i) => ({
            request_id: row.id,
            product_slug: i.slug,
            product_name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            reference_price: i.referencePrice,
          })),
        );
        if (iErr) {
          console.error(iErr);
          await supabaseAdmin.from("purchase_requests").delete().eq("id", row.id);
          throw new Error("Không lưu được yêu cầu, vui lòng thử lại.");
        }
      }

      let notification = "Đã ghi nhận trước đó";
      if (requestId) {
        notification = await notifySupplier(supabaseAdmin, requestId, code, supplier);
      }
      parts.push({ code, supplierName: supplier.name, isDemo: supplier.is_demo, items, notification });
    }
    return { parts };
  });

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

/**
 * Gửi thông báo nhà cung cấp.
 * - Ưu tiên Zalo OA khi đã cấu hình token + zalo_user_id.
 * - Nếu Zalo chưa dùng được hoặc gửi lỗi, thử SMS qua webhook/gateway cấu hình bằng biến môi trường.
 * - Không có cấu hình thì ghi log rõ ràng, không giả lập thành công.
 */
async function notifySupplier(
  admin: Admin,
  requestId: string,
  code: string,
  supplier: { is_demo: boolean; phone: string | null; zalo_user_id: string | null; contact_verified: boolean },
) {
  const log = async (channel: string, status: string, detail?: string) => {
    await admin.from("notification_log").insert({
      request_id: requestId,
      channel,
      status,
      detail: detail ?? null,
    });
  };

  if (supplier.is_demo) {
    await log("none", "Chưa gửi", "Yêu cầu thử nghiệm — không gửi thông báo thật");
    return "Chưa gửi — yêu cầu thử nghiệm";
  }
  if (!supplier.contact_verified) {
    await log("none", "Chưa gửi", "Thông tin liên hệ nhà cung cấp chưa xác minh");
    return "Chưa gửi — liên hệ chưa xác minh";
  }

  const message = `Bình Mỹ FarmGo: có yêu cầu mua mới ${code}. Vui lòng đăng nhập trang quản trị để tiếp nhận và xác nhận.`;
  let attempted = false;

  const zaloToken = process.env["ZALO_OA_ACCESS_TOKEN"];
  if (zaloToken && supplier.zalo_user_id) {
    attempted = true;
    try {
      const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
        method: "POST",
        headers: { "Content-Type": "application/json", access_token: zaloToken },
        body: JSON.stringify({
          recipient: { user_id: supplier.zalo_user_id },
          message: { text: message },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: number; message?: string };
      if (res.ok && body.error === 0) {
        await log("zalo_oa", "Đã gửi");
        return "Đã gửi qua Zalo OA";
      }
      await log("zalo_oa", "Gửi thất bại", `${res.status} ${body.message ?? ""}`.trim());
    } catch (e) {
      console.error(e);
      await log("zalo_oa", "Gửi thất bại", e instanceof Error ? e.message : "Lỗi không xác định");
    }
  }

  const smsUrl = process.env["SMS_WEBHOOK_URL"];
  const smsToken = process.env["SMS_WEBHOOK_TOKEN"];
  const smsSender = process.env["SMS_SENDER_ID"] ?? "BinhMyFarmGo";
  if (smsUrl && supplier.phone) {
    attempted = true;
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (smsToken) headers.Authorization = `Bearer ${smsToken}`;
      const res = await fetch(smsUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to: normPhone(supplier.phone),
          sender: smsSender,
          message,
        }),
      });
      if (res.ok) {
        await log("sms", "Đã gửi");
        return "Đã gửi qua SMS";
      }
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      await log("sms", "Gửi thất bại", `${res.status} ${detail}`.trim());
    } catch (e) {
      console.error(e);
      await log("sms", "Gửi thất bại", e instanceof Error ? e.message : "Lỗi không xác định");
    }
  }

  if (!attempted) {
    await log("none", "Chưa gửi", "Thiếu cấu hình Zalo OA/SMS hoặc thiếu thông tin nhận");
    return "Chưa gửi — thiếu cấu hình Zalo OA/SMS";
  }
  return "Gửi thông báo thất bại — vui lòng kiểm tra nhật ký";
}

/* ---------- Tra cứu yêu cầu ---------- */
const lookupSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^BMFG-\d{6}-[A-Z0-9]{10}$/),
  phone: z.string().trim().regex(phoneRe),
});

async function rateLimit(admin: Admin) {
  const ip =
    getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("lookup_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if ((count ?? 0) >= 10) return false;
  await admin.from("lookup_attempts").insert({ ip });
  return true;
}

export const lookupRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = lookupSchema.safeParse(d);
    return r.success ? r.data : null;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!(await rateLimit(supabaseAdmin)))
      return { ok: false as const, message: "Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau 15 phút." };
    const notFound = { ok: false as const, message: "Không tìm thấy yêu cầu phù hợp với thông tin đã nhập." };
    if (!data) return notFound;

    const { data: r } = await supabaseAdmin
      .from("purchase_requests")
      .select(
        "code, customer_phone, status, payment_status, updated_at, is_demo, confirmed_total, shipping_fee, supplier:suppliers(name, bank_verified, bank_bin, bank_name, bank_account, bank_holder)",
      )
      .eq("code", data.code)
      .maybeSingle();
    if (!r || r.customer_phone !== normPhone(data.phone)) return notFound;

    const s = r.supplier as unknown as {
      name: string;
      bank_verified: boolean;
      bank_bin: string | null;
      bank_name: string | null;
      bank_account: string | null;
      bank_holder: string | null;
    } | null;
    const amount = (r.confirmed_total ?? 0) + (r.shipping_fee ?? 0);
    const canPay =
      !r.is_demo &&
      r.status === "da_xac_nhan" &&
      r.confirmed_total != null &&
      r.payment_status !== "da_thanh_toan" &&
      !!s?.bank_verified &&
      !!s.bank_bin &&
      !!s.bank_account;

    return {
      ok: true as const,
      request: {
        code: r.code,
        supplierName: s?.name ?? "",
        status: r.status,
        paymentStatus: r.payment_status,
        updatedAt: r.updated_at,
        isDemo: r.is_demo,
        confirmedTotal: r.confirmed_total,
        shippingFee: r.shipping_fee,
        payment: canPay
          ? {
              amount,
              bankName: s!.bank_name ?? "",
              account: s!.bank_account!,
              holder: s!.bank_holder ?? "",
              content: r.code,
              qrUrl: `https://img.vietqr.io/image/${encodeURIComponent(s!.bank_bin!)}-${encodeURIComponent(
                s!.bank_account!,
              )}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(r.code)}&accountName=${encodeURIComponent(
                s!.bank_holder ?? "",
              )}`,
            }
          : null,
      },
    };
  });

/** Khách báo đã chuyển khoản → chỉ chuyển sang "Chờ kiểm tra". */
export const reportTransferred = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => lookupSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!(await rateLimit(supabaseAdmin))) return { ok: false, message: "Vui lòng thử lại sau." };
    const { data: r } = await supabaseAdmin
      .from("purchase_requests")
      .select("id, customer_phone, status, payment_status, is_demo, supplier:suppliers(bank_verified)")
      .eq("code", data.code)
      .maybeSingle();
    const bankOk = (r?.supplier as unknown as { bank_verified: boolean } | null)?.bank_verified;
    if (
      !r ||
      r.customer_phone !== normPhone(data.phone) ||
      r.is_demo ||
      r.status !== "da_xac_nhan" ||
      r.payment_status !== "chua_thanh_toan" ||
      !bankOk
    )
      return { ok: false, message: "Không thể cập nhật yêu cầu này." };
    const { error } = await supabaseAdmin
      .from("purchase_requests")
      .update({ payment_status: "cho_kiem_tra" })
      .eq("id", r.id);
    if (error) return { ok: false, message: "Không thể cập nhật, vui lòng thử lại." };
    return { ok: true, message: "Đã báo chuyển khoản. Người bán sẽ kiểm tra và xác nhận." };
  });

/* ---------- Quản trị: gán tài khoản cho nhà cung cấp ---------- */
export const assignSupplierMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().trim().email().max(255), supplierId: z.string().max(100) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Không có quyền.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let found: string | null = null;
    for (let page = 1; page <= 10 && !found; page++) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      found = list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase())?.id ?? null;
      if (!list || list.users.length < 200) break;
    }
    if (!found) return { ok: false, message: "Chưa có tài khoản với email này. Người dùng cần đăng ký trước." };
    await supabaseAdmin.from("user_roles").upsert({ user_id: found, role: "supplier" }, { onConflict: "user_id,role" });
    const { error } = await supabaseAdmin
      .from("supplier_members")
      .upsert({ user_id: found, supplier_id: data.supplierId }, { onConflict: "user_id,supplier_id" });
    if (error) return { ok: false, message: "Không gán được." };
    return { ok: true, message: "Đã gán tài khoản cho nhà cung cấp." };
  });
