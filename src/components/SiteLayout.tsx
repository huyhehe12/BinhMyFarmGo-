import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import farmGoLogo from "@/assets/logo-farmgo.png";
import { FloatingContactMenu } from "@/components/FloatingContactMenu";
import { useRequestCart } from "@/lib/request-cart";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/san-pham", label: "Nông sản" },
  { to: "/don-vi-cung-cap", label: "Đơn vị cung cấp" },
  { to: "/du-lich", label: "Du lịch nông nghiệp" },
  { to: "/ban-do", label: "Bản đồ" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
] as const;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold text-primary">
      <img
        src={farmGoLogo}
        alt="Logo Bình Mỹ FarmGo"
        width={96}
        height={96}
        className={`${compact ? "h-9 w-9" : "h-11 w-11"} shrink-0 object-contain`}
      />
      <span className={compact ? "text-base sm:text-lg" : "text-lg"}>Bình Mỹ FarmGo</span>
    </Link>
  );
}

function SiteHeader() {
  const { totalQuantity } = useRequestCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Brand compact />

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "font-semibold text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/dat-mua"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Yêu cầu mua
            <span className="inline-flex min-w-6 justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs">
              {totalQuantity}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Mở menu"
            aria-expanded={open}
            className="rounded-md border border-border px-3 py-2 text-sm md:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted-foreground"
              activeProps={{ className: "block py-2 text-sm font-semibold text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-sidebar">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="rounded-2xl bg-background/70 p-2">
          <img src={farmGoLogo} alt="Logo Bình Mỹ FarmGo" className="h-16 w-16 object-contain" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Bình Mỹ FarmGo</p>
          <p className="mt-2 max-w-3xl">
            Nền tảng thử nghiệm hỗ trợ quảng bá nông sản, kết nối yêu cầu mua và trải nghiệm du
            lịch nông nghiệp Bình Mỹ. Một số dữ liệu về giá, đơn vị cung cấp và địa điểm vẫn đang
            được xác minh trước khi triển khai thực tế.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="border-b border-border bg-secondary text-secondary-foreground">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs sm:text-sm">
          Phiên bản sau cải tiến: lưu yêu cầu mua, thông báo nhà cung cấp, tra cứu thanh toán QR và bản đồ địa điểm đã xác minh.
        </p>
      </div>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContactMenu />
    </div>
  );
}
