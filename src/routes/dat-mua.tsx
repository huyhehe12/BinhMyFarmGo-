import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, QrCode, SearchCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { formatPrice, getProduct, type Product } from "@/data/products";
import { getSupplier } from "@/data/suppliers";
import { useRequestCart } from "@/lib/request-cart";
import {
  lookupRequest,
  reportTransferred,
  submitPurchaseRequest,
  type SubmittedPart,
} from "@/lib/farmgo.functions";

export const Route = createFileRoute("/dat-mua")({
  head: () => ({
    meta: [
      { title: "Yêu cầu đặt mua — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Gửi yêu cầu mua, nhận mã tra cứu, theo dõi trạng thái và thanh toán VietQR sau khi nhà cung cấp xác nhận.",
      },
      { property: "og:title", content: "Yêu cầu đặt mua nông sản Bình Mỹ" },
      {
        property: "og:description",
        content:
          "Yêu cầu mua được lưu để nhà cung cấp xác nhận; khách có thể tra cứu trạng thái và VietQR theo mã yêu cầu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RequestPage,
});

const deliveryChoices = [
  "Nhận tại vườn/điểm bán",
  "Giao đến địa chỉ",
  "Trao đổi với người bán",
] as const;
const timeChoices = ["Sáng", "Chiều", "Linh hoạt"] as const;
const contactChoices = ["Điện thoại", "Zalo"] as const;

const vnd = (n: number) => `${n.toLocaleString("vi-VN")} đ`;

function priceRange(product?: Product): [number, number] | null {
  if (!product?.referencePrice) return null;
  const nums = product.referencePrice.match(/[\d.]+/g)?.map((x) => Number(x.replace(/\./g, "")));
  if (!nums?.length) return null;
  const a = nums[0] ?? 0;
  return [a, nums[1] ?? a];
}

function formatRange(r: [number, number] | null, qty: number) {
  if (!r) return "Chưa có dữ liệu giá xác minh";
  const [a, b] = [r[0] * qty, r[1] * qty];
  return a === b ? vnd(a) : `${vnd(a)} – ${vnd(b)}`;
}

const schema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập họ tên.").max(100, "Họ tên quá dài."),
    phone: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số điện thoại.")
      .regex(/^(\+?84|0)\d{9,10}$/, "Số điện thoại chưa hợp lệ."),
    contact: z.string(),
    delivery: z.string().min(1, "Vui lòng chọn hình thức nhận hàng."),
    address: z.string().trim().max(300, "Địa chỉ quá dài."),
    date: z.string(),
    time: z.string(),
    note: z.string().max(1000, "Ghi chú quá dài."),
    agree: z.literal(true, { message: "Vui lòng đồng ý để được liên hệ xác nhận." }),
  })
  .refine((d) => d.delivery !== "Giao đến địa chỉ" || d.address.length > 0, {
    path: ["address"],
    message: "Vui lòng nhập địa chỉ nhận hàng.",
  });

type Form = {
  name: string;
  phone: string;
  contact: string;
  delivery: string;
  address: string;
  date: string;
  time: string;
  note: string;
  agree: boolean;
};

type Line = { slug: string; name: string; quantity: number; unit: string; subtotal: string };

const inputCls =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring";

function Err({ msg }: { msg?: string | undefined }) {
  return msg ? <p className="mt-1 text-xs text-destructive">{msg}</p> : null;
}

function RequestPage() {
  const { items, setQuantity, removeItem, clear } = useRequestCart();
  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    contact: "Điện thoại",
    delivery: "",
    address: "",
    date: "",
    time: "Linh hoạt",
    note: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitted, setSubmitted] = useState<{
    parts: SubmittedPart[];
    total: string;
    form: Form;
  } | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const submitKey = useRef<string>("");
  const submitFn = useServerFn(submitPurchaseRequest);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const { lines, total } = useMemo(() => {
    let min = 0,
      max = 0,
      missing = false;
    const lines: Line[] = items.map((i) => {
      const p = getProduct(i.slug);
      const r = priceRange(p);
      if (r) {
        min += r[0] * i.quantity;
        max += r[1] * i.quantity;
      } else missing = true;
      return {
        slug: i.slug,
        name: i.name,
        quantity: i.quantity,
        unit: p?.unit ?? "kg",
        subtotal: formatRange(r, i.quantity),
      };
    });
    let total = min === max ? vnd(min) : `${vnd(min)} – ${vnd(max)}`;
    if (missing) total += " (chưa gồm sản phẩm chưa có dữ liệu giá xác minh)";
    return { lines, total };
  }, [items]);

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Partial<Record<keyof Form, string>> = {};
      for (const issue of res.error.issues) {
        const k = String(issue.path[0]) as keyof Form;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSendError(null);
    if (!submitKey.current) submitKey.current = crypto.randomUUID();
    setSending(true);
    try {
      const out = await submitFn({
        data: {
          submissionKey: submitKey.current,
          name: form.name,
          phone: form.phone,
          contact: form.contact,
          delivery: form.delivery,
          address: form.address,
          date: form.date,
          time: form.time,
          note: form.note,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        },
      });
      setSubmitted({ parts: out.parts, total, form });
      submitKey.current = "";
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setSendError("Chưa gửi được yêu cầu. Thông tin của bạn vẫn được giữ, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    const allDemo = submitted.parts.every((p) => p.isDemo);
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-bold">Đã ghi nhận yêu cầu mua</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Yêu cầu được tách theo từng đơn vị cung cấp. Hãy lưu lại mã để tra cứu.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {submitted.parts.map((part) => (
              <div key={part.code} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-bold tracking-wide text-primary">{part.code}</p>
                  {part.isDemo && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      Yêu cầu thử nghiệm
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{part.supplierName}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {part.items.map((i) => (
                    <li key={i.name}>
                      {i.name} × {i.quantity} {i.unit}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Thông báo đến nhà cung cấp: {part.notification}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tạm tính</dt>
              <dd className="text-right font-semibold">{submitted.total}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Hình thức nhận hàng</dt>
              <dd className="text-right">{submitted.form.delivery}</dd>
            </div>
          </dl>

          {showDetail && (
            <dl className="mt-4 space-y-1 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
              <div>Họ và tên: {submitted.form.name}</div>
              <div>Số điện thoại: {submitted.form.phone}</div>
              <div>Liên hệ ưu tiên: {submitted.form.contact}</div>
              {submitted.form.address && <div>Địa chỉ: {submitted.form.address}</div>}
              {submitted.form.date && <div>Ngày mong muốn: {submitted.form.date}</div>}
              <div>Thời gian: {submitted.form.time}</div>
              {submitted.form.note && <div>Ghi chú: {submitted.form.note}</div>}
            </dl>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/san-pham"
              className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Tiếp tục xem nông sản
            </Link>
            <button
              type="button"
              onClick={() => setShowDetail((v) => !v)}
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
            >
              {showDetail ? "Ẩn yêu cầu" : "Xem yêu cầu"}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {allDemo
              ? "Bản thử nghiệm: yêu cầu thuộc đơn vị cung cấp minh họa, không được gửi đến người bán thật và không nhận thanh toán."
              : "Giá cuối cùng, phí giao hàng và tình trạng hàng sẽ do người bán xác nhận. Bạn có thể tra cứu bằng mã yêu cầu."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Yêu cầu đặt mua</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Chọn số lượng, điền thông tin liên hệ và gửi yêu cầu. Hệ thống sẽ lưu yêu cầu, tạo mã
        tra cứu và chuyển thông báo đến nhà cung cấp đủ điều kiện xác minh.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <BellRing className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">Thông báo Zalo & SMS</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Ưu tiên Zalo OA, hỗ trợ SMS dự phòng khi đã cấu hình.</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <SearchCheck className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">Tra cứu trạng thái</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Dùng mã BMFG và số điện thoại để xem trạng thái đơn.</p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
          <QrCode className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-semibold">VietQR động</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Hiện QR đúng số tiền sau khi nhà cung cấp xác nhận đơn.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Bạn chưa chọn sản phẩm nào. Hãy chọn nông sản muốn mua để tạo yêu cầu.
          </p>
          <Link
            to="/san-pham"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Khám phá nông sản
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold">Sản phẩm đã chọn</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item, idx) => {
                  const product = getProduct(item.slug);
                  const supplier = product ? getSupplier(product.supplierId) : undefined;
                  return (
                    <li
                      key={item.slug}
                      className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                    >
                      {product && (
                        <img
                          src={product.image}
                          alt={product.imageAlt}
                          loading="lazy"
                          width={1024}
                          height={768}
                          className="h-20 w-24 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold">{item.name}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.slug)}
                            className="text-sm text-destructive hover:underline"
                          >
                            Xóa
                          </button>
                        </div>
                        {supplier && (
                          <p className="text-sm text-muted-foreground">{supplier.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Giá tham khảo:{" "}
                          {product ? formatPrice(product) : "Chưa có dữ liệu giá xác minh"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              aria-label="Giảm số lượng"
                              onClick={() => setQuantity(item.slug, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8 rounded-full text-lg"
                            >
                              −
                            </button>
                            <span className="min-w-14 text-center text-sm">
                              {item.quantity} {product?.unit ?? "kg"}
                            </span>
                            <button
                              type="button"
                              aria-label="Tăng số lượng"
                              onClick={() => setQuantity(item.slug, item.quantity + 1)}
                              className="h-8 w-8 rounded-full text-lg"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm">
                            Tạm tính:{" "}
                            <span className="font-semibold text-primary">{lines[idx]?.subtotal}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <h2 className="text-xl font-semibold">Thông tin khách hàng</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium">Họ và tên *</span>
                  <input
                    value={form.name}
                    maxLength={100}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputCls}
                  />
                  <Err msg={errors.name} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Số điện thoại *</span>
                  <input
                    inputMode="tel"
                    maxLength={15}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputCls}
                  />
                  <Err msg={errors.phone} />
                </label>
              </div>

              <fieldset className="text-sm">
                <legend className="font-medium">Phương thức liên hệ ưu tiên</legend>
                <div className="mt-2 flex gap-4">
                  {contactChoices.map((c) => (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contact"
                        checked={form.contact === c}
                        onChange={() => set("contact", c)}
                        className="accent-primary"
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="text-sm">
                <legend className="font-medium">Hình thức nhận hàng *</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {deliveryChoices.map((d) => (
                    <label
                      key={d}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${
                        form.delivery === d ? "border-primary bg-secondary" : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={form.delivery === d}
                        onChange={() => set("delivery", d)}
                        className="accent-primary"
                      />
                      {d}
                    </label>
                  ))}
                </div>
                <Err msg={errors.delivery} />
              </fieldset>

              {form.delivery === "Giao đến địa chỉ" && (
                <label className="block text-sm">
                  <span className="font-medium">Địa chỉ nhận hàng *</span>
                  <input
                    value={form.address}
                    maxLength={300}
                    onChange={(e) => set("address", e.target.value)}
                    className={inputCls}
                  />
                  <Err msg={errors.address} />
                </label>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium">Ngày mong muốn nhận hàng</span>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Thời gian</span>
                  <select
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                    className={inputCls}
                  >
                    {timeChoices.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium">Ghi chú</span>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.note}
                  placeholder="Ví dụ: chọn rau non, giao sau 17h, vui lòng liên hệ qua Zalo..."
                  onChange={(e) => set("note", e.target.value)}
                  className={inputCls}
                />
              </label>
            </section>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold">Tổng kết</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Giá sản phẩm dự kiến</dt>
                <dd className="text-right">{total}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phí giao hàng</dt>
                <dd>Xác nhận sau</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-2 text-base">
                <dt className="font-semibold">Tổng dự kiến</dt>
                <dd className="text-right font-bold text-primary">{total}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Giá cuối cùng và tình trạng sản phẩm sẽ được đơn vị cung cấp xác nhận.
            </p>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => set("agree", e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                Tôi đồng ý để Bình Mỹ FarmGo sử dụng thông tin trên để liên hệ xác nhận yêu cầu
                mua.
              </span>
            </label>
            <Err msg={errors.agree} />
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {sending ? "Đang gửi..." : "Gửi yêu cầu mua"}
            </button>
            {sendError && <p className="text-center text-xs text-destructive">{sendError}</p>}
            {Object.keys(errors).length > 0 && (
              <p className="text-center text-xs text-destructive">
                Vui lòng kiểm tra lại các thông tin còn thiếu.
              </p>
            )}
          </aside>
        </form>
      )}
      <LookupSection />
    </div>
  );
}

const statusLabel: Record<string, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  hoan_tat: "Hoàn tất",
  da_huy: "Đã hủy",
};
const paymentLabel: Record<string, string> = {
  chua_thanh_toan: "Chưa thanh toán",
  cho_kiem_tra: "Chờ kiểm tra",
  da_thanh_toan: "Đã thanh toán",
};

function LookupSection() {
  const lookup = useServerFn(lookupRequest);
  const report = useServerFn(reportTransferred);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupRequest>> | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await lookup({ data: { code, phone } });
      setResult(r);
      if (!r.ok) setMsg(r.message);
    } catch {
      setMsg("Không thể tra cứu lúc này, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function transferred() {
    setBusy(true);
    try {
      const r = await report({ data: { code, phone } });
      setMsg(r.message);
      if (r.ok) await run();
    } finally {
      setBusy(false);
    }
  }

  const req = result?.ok ? result.request : null;
  return (
    <section id="tra-cuu" className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-5">
      <h2 className="text-xl font-semibold">Tra cứu yêu cầu</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nhập mã yêu cầu và số điện thoại đã dùng khi gửi.
      </p>
      <form onSubmit={run} className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr_auto]">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="BMFG-..."
          maxLength={30}
          aria-label="Mã yêu cầu"
          className={inputCls + " mt-0"}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại"
          inputMode="tel"
          maxLength={15}
          aria-label="Số điện thoại"
          className={inputCls + " mt-0"}
        />
        <button
          disabled={busy || !code || !phone}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Tra cứu
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
      {req && (
        <div className="mt-4 space-y-2 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
          <div className="font-semibold">{req.code}</div>
          {req.isDemo && (
            <div className="inline-flex rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
              Yêu cầu thử nghiệm — không gửi đến người bán thật, không nhận thanh toán
            </div>
          )}
          <div>Nhà cung cấp: {req.supplierName}</div>
          <div>Trạng thái: {statusLabel[req.status]}</div>
          {!req.isDemo && <div>Thanh toán: {paymentLabel[req.paymentStatus]}</div>}
          {req.confirmedTotal != null && (
            <div>
              Tổng xác nhận: {vnd(req.confirmedTotal)}
              {req.shippingFee != null && ` + phí giao ${vnd(req.shippingFee)}`}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Cập nhật: {new Date(req.updatedAt).toLocaleString("vi-VN")}
          </div>
          {req.payment && (
            <div className="mt-3 rounded-xl border border-border bg-background p-4 text-center">
              <p className="font-semibold">Thanh toán chuyển khoản</p>
              <img
                src={req.payment.qrUrl}
                alt={`Mã QR chuyển khoản ${vnd(req.payment.amount)} cho ${req.payment.holder}`}
                className="mx-auto mt-2 h-56 w-56 object-contain"
              />
              <dl className="mt-2 space-y-1 text-left text-sm">
                <div>Người nhận: {req.payment.holder}</div>
                <div>Ngân hàng: {req.payment.bankName}</div>
                <div>Số tài khoản: {req.payment.account}</div>
                <div>Số tiền: {vnd(req.payment.amount)}</div>
                <div>Nội dung: {req.payment.content}</div>
              </dl>
              {req.paymentStatus === "chua_thanh_toan" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={transferred}
                  className="mt-3 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
                >
                  Tôi đã chuyển khoản
                </button>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Trạng thái "Đã thanh toán" chỉ được cập nhật sau khi người bán kiểm tra tiền thực nhận.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
