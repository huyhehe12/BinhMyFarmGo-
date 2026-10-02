import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { assignSupplierMember } from "@/lib/farmgo.functions";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/quan-tri")({
  head: () => ({
    meta: [
      { title: "Quản trị yêu cầu mua — Bình Mỹ FarmGo" },
      { name: "description", content: "Quản lý yêu cầu mua, nhà cung cấp và địa điểm Bình Mỹ FarmGo." },
      { property: "og:title", content: "Quản trị Bình Mỹ FarmGo" },
      { property: "og:description", content: "Khu vực quản trị dành cho quản trị viên và đơn vị cung cấp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Status = Database["public"]["Enums"]["request_status"];
const statusLabel: Record<Status, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  hoan_tat: "Hoàn tất",
  da_huy: "Đã hủy",
};
const payLabel = { chua_thanh_toan: "Chưa thanh toán", cho_kiem_tra: "Chờ kiểm tra", da_thanh_toan: "Đã thanh toán" };
const nextStatus: Record<Status, Status[]> = {
  cho_xac_nhan: ["da_xac_nhan", "da_huy"],
  da_xac_nhan: ["hoan_tat", "da_huy"],
  hoan_tat: [],
  da_huy: [],
};
const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";
const errMsg = (e: { message?: string } | null) => e?.message ?? "Có lỗi xảy ra";

function AdminPage() {
  const navigate = useNavigate();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user!.id);
      return { email: u.user?.email, roles: (roles ?? []).map((r) => r.role) };
    },
  });
  const isAdmin = me?.roles.includes("admin");
  const hasAccess = isAdmin || me?.roles.includes("supplier");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Quản trị</h1>
          <p className="text-sm text-muted-foreground">
            {me?.email} · {isAdmin ? "Quản trị viên" : hasAccess ? "Đơn vị cung cấp" : "Chưa được cấp quyền"}
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="rounded-full border border-border px-4 py-2 text-sm"
        >
          Đăng xuất
        </button>
      </div>
      {me && !hasAccess && (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-sm">
          Tài khoản chưa được cấp quyền. Vui lòng liên hệ quản trị viên để được gán vào đơn vị cung cấp.
        </p>
      )}
      {hasAccess && <Requests isAdmin={!!isAdmin} />}
      {isAdmin && <Suppliers />}
      {isAdmin && <Locations />}
    </div>
  );
}

function Requests({ isAdmin }: { isAdmin: boolean }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select("*, request_items(*), suppliers(name), notification_log(status, detail, created_at)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Yêu cầu mua {isAdmin ? "(tất cả)" : "của đơn vị"}</h2>
      {isLoading && <p className="mt-3 text-sm text-muted-foreground">Đang tải...</p>}
      {data?.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Chưa có yêu cầu.</p>}
      <div className="mt-4 grid gap-4">
        {data?.map((r) => (
          <RequestCard key={r.id} r={r} onChange={() => qc.invalidateQueries({ queryKey: ["requests"] })} />
        ))}
      </div>
    </section>
  );
}

function RequestCard({ r, onChange }: { r: any; onChange: () => void }) {
  const [total, setTotal] = useState<string>(r.confirmed_total?.toString() ?? "");
  const [fee, setFee] = useState<string>(r.shipping_fee?.toString() ?? "");
  const [note, setNote] = useState<string>(r.seller_note ?? "");
  const [busy, setBusy] = useState(false);

  async function update(patch: Database["public"]["Tables"]["purchase_requests"]["Update"]) {
    setBusy(true);
    const { error } = await supabase.from("purchase_requests").update(patch).eq("id", r.id);
    setBusy(false);
    if (error) toast.error(errMsg(error));
    else {
      toast.success("Đã cập nhật");
      onChange();
    }
  }
  const money = () => ({
    confirmed_total: total === "" ? null : Math.max(0, Math.round(Number(total))),
    shipping_fee: fee === "" ? null : Math.max(0, Math.round(Number(fee))),
    seller_note: note || null,
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-primary">{r.code}</p>
        <div className="flex gap-2">
          {r.is_demo && <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Thử nghiệm</span>}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{statusLabel[r.status as Status]}</span>
          {!r.is_demo && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
              {payLabel[r.payment_status as keyof typeof payLabel]}
            </span>
          )}
        </div>
      </div>
      <p className="text-muted-foreground">
        {r.suppliers?.name} · {new Date(r.created_at).toLocaleString("vi-VN")}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p>
            <b>{r.customer_name}</b> · {r.customer_phone} ({r.contact_method})
          </p>
          <p>
            {r.delivery_method}
            {r.address ? ` — ${r.address}` : ""}
          </p>
          {(r.desired_date || r.time_slot) && (
            <p>
              Mong muốn: {r.desired_date ?? ""} {r.time_slot ?? ""}
            </p>
          )}
          {r.note && <p>Ghi chú: {r.note}</p>}
        </div>
        <ul>
          {r.request_items.map((i: any) => (
            <li key={i.id}>
              {i.product_name} × {i.quantity} {i.unit}{" "}
              <span className="text-muted-foreground">({i.reference_price ?? "chưa có giá"})</span>
            </li>
          ))}
        </ul>
      </div>
      {r.notification_log?.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Thông báo: {r.notification_log.map((n: any) => `${n.status}${n.detail ? ` (${n.detail})` : ""}`).join("; ")}
        </p>
      )}

      {(r.status === "cho_xac_nhan" || r.status === "da_xac_nhan") && (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <input className={inputCls} inputMode="numeric" placeholder="Tổng tiền hàng (đ)" value={total} onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))} />
          <input className={inputCls} inputMode="numeric" placeholder="Phí giao hàng (đ)" value={fee} onChange={(e) => setFee(e.target.value.replace(/\D/g, ""))} />
          <input className={inputCls} placeholder="Ghi chú người bán" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {(r.status === "cho_xac_nhan" || r.status === "da_xac_nhan") && (
          <button disabled={busy} onClick={() => update(money())} className="rounded-full border border-border px-3 py-1.5">
            Lưu giá
          </button>
        )}
        {nextStatus[r.status as Status].map((s) => (
          <button
            key={s}
            disabled={busy}
            onClick={() => update({ ...(s === "da_xac_nhan" ? money() : {}), status: s })}
            className={`rounded-full px-3 py-1.5 ${s === "da_huy" ? "border border-destructive text-destructive" : "bg-primary text-primary-foreground"}`}
          >
            {s === "da_xac_nhan" ? "Xác nhận còn hàng & tổng tiền" : statusLabel[s]}
          </button>
        ))}
        {!r.is_demo && r.status !== "da_huy" && r.payment_status !== "da_thanh_toan" && r.status !== "cho_xac_nhan" && (
          <button
            disabled={busy}
            onClick={() => {
              if (confirm("Chỉ xác nhận khi đã kiểm tra tiền thực nhận trong tài khoản. Tiếp tục?"))
                update({ payment_status: "da_thanh_toan" });
            }}
            className="rounded-full border border-primary px-3 py-1.5 text-primary"
          >
            Đã nhận tiền
          </button>
        )}
      </div>
      {r.payment_confirmed_at && (
        <p className="mt-2 text-xs text-muted-foreground">
          Xác nhận thanh toán lúc {new Date(r.payment_confirmed_at).toLocaleString("vi-VN")}
        </p>
      )}
    </div>
  );
}

function Suppliers() {
  const qc = useQueryClient();
  const assign = useServerFn(assignSupplierMember);
  const { data } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => (await supabase.from("suppliers").select("*").order("name")).data ?? [],
  });
  const [email, setEmail] = useState("");
  const [sid, setSid] = useState("");
  const [form, setForm] = useState({ id: "", name: "" });

  async function save(id: string, patch: Database["public"]["Tables"]["suppliers"]["Update"]) {
    const { error } = await supabase.from("suppliers").update(patch).eq("id", id);
    if (error) toast.error(errMsg(error));
    else qc.invalidateQueries({ queryKey: ["suppliers"] });
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Nhà cung cấp</h2>
      <div className="mt-4 grid gap-4">
        {data?.map((s) => (
          <SupplierRow key={s.id} s={s} onSave={(p) => save(s.id, p)} />
        ))}
      </div>
      <form
        className="mt-4 grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={async (e) => {
          e.preventDefault();
          const id = form.id.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
          if (!id || !form.name.trim()) return;
          const { error } = await supabase.from("suppliers").insert({ id, name: form.name.trim(), is_demo: false });
          if (error) toast.error(errMsg(error));
          else {
            setForm({ id: "", name: "" });
            qc.invalidateQueries({ queryKey: ["suppliers"] });
          }
        }}
      >
        <input className={inputCls} placeholder="Mã (vd: ho-nguyen-van-a)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <input className={inputCls} placeholder="Tên nhà cung cấp thật" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Thêm</button>
      </form>
      <form
        className="mt-3 grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const r = await assign({ data: { email, supplierId: sid } });
            r.ok ? toast.success(r.message) : toast.error(r.message);
          } catch {
            toast.error("Không gán được.");
          }
        }}
      >
        <input className={inputCls} type="email" placeholder="Email tài khoản người bán" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className={inputCls} value={sid} onChange={(e) => setSid(e.target.value)}>
          <option value="">Chọn nhà cung cấp</option>
          {data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button disabled={!email || !sid} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">
          Gán tài khoản
        </button>
      </form>
    </section>
  );
}

function SupplierRow({ s, onSave }: { s: any; onSave: (p: any) => void }) {
  const [v, setV] = useState({
    phone: s.phone ?? "",
    zalo_user_id: s.zalo_user_id ?? "",
    bank_bin: s.bank_bin ?? "",
    bank_name: s.bank_name ?? "",
    bank_account: s.bank_account ?? "",
    bank_holder: s.bank_holder ?? "",
  });
  const f = (k: keyof typeof v, label: string) => (
    <input className={inputCls} placeholder={label} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
  );
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">
          {s.name} <span className="text-xs text-muted-foreground">({s.id})</span>
        </p>
        {s.is_demo && <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Minh họa</span>}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {f("phone", "Số điện thoại")}
        {f("zalo_user_id", "Zalo user ID (theo OA)")}
        {f("bank_name", "Tên ngân hàng")}
        {f("bank_bin", "Mã BIN ngân hàng (VietQR)")}
        {f("bank_account", "Số tài khoản")}
        {f("bank_holder", "Chủ tài khoản")}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={() => onSave(Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x.trim() || null])))} className="rounded-full border border-border px-3 py-1.5">
          Lưu
        </button>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={s.contact_verified} onChange={(e) => onSave({ contact_verified: e.target.checked })} />
          Liên hệ đã xác minh
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" disabled={s.is_demo} checked={s.bank_verified} onChange={(e) => onSave({ bank_verified: e.target.checked })} />
          Tài khoản nhận tiền đã xác minh
        </label>
      </div>
    </div>
  );
}

function Locations() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => (await supabase.from("locations").select("*").order("created_at")).data ?? [],
  });
  const empty = { name: "", category: "diem_ban", address: "", contact: "", maps_url: "", embed_url: "" };
  const [v, setV] = useState(empty);
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Địa điểm trên bản đồ</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {data?.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3">
            <span>
              <b>{l.name}</b> · {l.address}
            </span>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={l.verified}
                onChange={async (e) => {
                  const { error } = await supabase.from("locations").update({ verified: e.target.checked }).eq("id", l.id);
                  if (error) toast.error(errMsg(error));
                  qc.invalidateQueries({ queryKey: ["admin-locations"] });
                }}
              />
              Đã xác minh (công khai)
            </label>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await supabase.from("locations").insert({
            name: v.name.trim(),
            category: v.category as Database["public"]["Enums"]["location_category"],
            address: v.address.trim() || null,
            contact: v.contact.trim() || null,
            maps_url: v.maps_url.trim(),
            embed_url: v.embed_url.trim() || null,
          });
          if (error) toast.error("Kiểm tra lại: cần địa chỉ, link Google Maps hợp lệ; link nhúng phải bắt đầu bằng https://www.google.com/maps/embed?pb=");
          else {
            setV(empty);
            qc.invalidateQueries({ queryKey: ["admin-locations"] });
          }
        }}
      >
        <input required className={inputCls} placeholder="Tên địa điểm" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
        <select className={inputCls} value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })}>
          <option value="diem_ban">Điểm bán nông sản</option>
          <option value="nha_vuon">Nhà vườn</option>
          <option value="trai_nghiem">Điểm trải nghiệm nông nghiệp</option>
          <option value="diem_nhan_hang">Điểm nhận hàng</option>
        </select>
        <input required className={inputCls} placeholder="Địa chỉ đã xác minh" value={v.address} onChange={(e) => setV({ ...v, address: e.target.value })} />
        <input className={inputCls} placeholder="Liên hệ (nếu có)" value={v.contact} onChange={(e) => setV({ ...v, contact: e.target.value })} />
        <input required className={inputCls} placeholder="Link mở Google Maps" value={v.maps_url} onChange={(e) => setV({ ...v, maps_url: e.target.value })} />
        <input className={inputCls} placeholder="Link nhúng (src của iframe Google Maps)" value={v.embed_url} onChange={(e) => setV({ ...v, embed_url: e.target.value })} />
        <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground sm:col-span-2">Thêm địa điểm (chưa công khai)</button>
      </form>
    </section>
  );
}
