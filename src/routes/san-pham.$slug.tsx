import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getProduct } from "@/data/products";
import { getSupplier } from "@/data/suppliers";
import { useRequestCart } from "@/lib/request-cart";

export const Route = createFileRoute("/san-pham/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Không tìm thấy sản phẩm" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Bình Mỹ FarmGo` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — Bình Mỹ FarmGo` },
        { property: "og:description", content: product.description },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
      <p className="mt-3 text-muted-foreground">
        Sản phẩm bạn tìm không có trong danh mục nông sản của nguyên mẫu.
      </p>
      <Link
        to="/san-pham"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        Về trang Nông sản
      </Link>
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const supplier = getSupplier(product.supplierId);
  const { addItem } = useRequestCart();
  const [added, setAdded] = useState(false);

  const rows = [
    ["Loại sản phẩm", product.category],
    ["Nguồn gốc", product.origin],
    ["Mùa vụ", product.season],
    ["Giá tham khảo", formatPrice(product)],
    ["Đơn vị cung cấp", supplier?.name ?? "Đang cập nhật"],
    ["Điểm nhận hàng", product.pickupPoint],
    ["Hình thức giao nhận", product.delivery],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/san-pham" className="text-sm text-primary hover:underline">
        ← Nông sản Bình Mỹ
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={1024}
          height={768}
          className="aspect-4/3 w-full rounded-2xl border border-border object-cover"
        />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-wrap gap-1 px-4 py-3 text-sm">
                <dt className="w-44 font-medium text-foreground">{label}</dt>
                <dd className="flex-1 text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                addItem(product.slug, product.name);
                setAdded(true);
              }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Thêm vào yêu cầu đặt mua
            </button>
            {added && (
              <Link to="/dat-mua" className="text-sm font-medium text-primary hover:underline">
                Đã thêm — xem yêu cầu đặt mua
              </Link>
            )}
          </div>

          <p className="mt-6 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
            Thông tin và giá trong bản prototype mang tính minh họa và sẽ được cập nhật bằng dữ
            liệu thực tế khi triển khai.
          </p>
        </div>
      </div>
    </div>
  );
}
