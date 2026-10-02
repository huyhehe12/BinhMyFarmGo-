import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, seasons } from "@/data/products";

export const Route = createFileRoute("/san-pham/")({
  head: () => ({
    meta: [
      { title: "Nông sản Bình Mỹ — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Danh mục nông sản Bình Mỹ kèm loại sản phẩm, mùa vụ, giá tham khảo, nguồn gốc và đơn vị cung cấp.",
      },
      { property: "og:title", content: "Nông sản Bình Mỹ" },
      {
        property: "og:description",
        content: "Khám phá sản phẩm nông nghiệp địa phương, nguồn gốc, mùa vụ và giá tham khảo.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [category, setCategory] = useState("all");
  const [season, setSeason] = useState("all");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (season === "all" || p.season === season),
      ),
    [category, season],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Nông sản Bình Mỹ</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Khám phá các sản phẩm nông nghiệp địa phương, nguồn gốc, mùa vụ và giá tham khảo.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Loại nông sản</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-52 rounded-lg border border-input bg-card px-3 py-2"
          >
            <option value="all">Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Mùa vụ</span>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="min-w-52 rounded-lg border border-input bg-card px-3 py-2"
          >
            <option value="all">Tất cả</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Chưa có sản phẩm phù hợp với lựa chọn này.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
