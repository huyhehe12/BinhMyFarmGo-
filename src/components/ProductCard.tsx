import { Link } from "@tanstack/react-router";
import { formatPrice, type Product } from "@/data/products";
import { getSupplier } from "@/data/suppliers";
import { useRequestCart } from "@/lib/request-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useRequestCart();
  const supplier = getSupplier(product.supplierId);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to="/san-pham/$slug" params={{ slug: product.slug }} className="block">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          width={1024}
          height={768}
          className="aspect-4/3 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
        </div>
        <dl className="mt-1 space-y-1 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">Loại:</dt>
            <dd>{product.category}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">Mùa vụ:</dt>
            <dd>{product.season}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">Giá tham khảo:</dt>
            <dd>{formatPrice(product)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">Nguồn gốc:</dt>
            <dd>{product.origin}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">Đơn vị cung cấp:</dt>
            <dd>{supplier?.name ?? "Đang cập nhật"}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            to="/san-pham/$slug"
            params={{ slug: product.slug }}
            className="inline-flex items-center rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Xem chi tiết
          </Link>
          <button
            type="button"
            onClick={() => addItem(product.slug, product.name)}
            className="inline-flex items-center rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Thêm vào yêu cầu mua
          </button>
        </div>
      </div>
    </article>
  );
}
