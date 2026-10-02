import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { suppliers } from "@/data/suppliers";

export const Route = createFileRoute("/don-vi-cung-cap")({
  head: () => ({
    meta: [
      { title: "Đơn vị cung cấp — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Các nhóm cung cấp nông sản tại Bình Mỹ được mô tả dưới dạng dữ liệu minh họa cho nguyên mẫu.",
      },
      { property: "og:title", content: "Đơn vị cung cấp nông sản Bình Mỹ" },
      {
        property: "og:description",
        content: "Nhóm cung cấp, nhóm sản phẩm và khu vực hoạt động ở mức tổng quát.",
      },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Đơn vị cung cấp</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Các nhóm cung cấp dưới đây được xây dựng dưới dạng dữ liệu minh họa cho nguyên mẫu.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {suppliers.map((supplier) => {
          const linked = products.filter((p) => p.supplierId === supplier.id);
          return (
            <article
              key={supplier.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{supplier.name}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{supplier.intro}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex flex-wrap gap-1">
                  <dt className="font-medium">Nhóm sản phẩm:</dt>
                  <dd className="text-muted-foreground">{supplier.productGroup}</dd>
                </div>
                <div className="flex flex-wrap gap-1">
                  <dt className="font-medium">Khu vực hoạt động:</dt>
                  <dd className="text-muted-foreground">{supplier.area}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm font-medium">Sản phẩm liên kết</p>
              {linked.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">Đang cập nhật.</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {linked.map((product) => (
                    <li key={product.slug}>
                      <Link
                        to="/san-pham/$slug"
                        params={{ slug: product.slug }}
                        className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
