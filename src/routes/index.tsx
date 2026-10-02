import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, MapPinned, QrCode, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/hero-binh-my.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { experiences } from "@/data/experiences";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bình Mỹ FarmGo — Nông sản và du lịch nông nghiệp Bình Mỹ" },
      {
        name: "description",
        content:
          "Khám phá nông sản Bình Mỹ, nguồn gốc, giá tham khảo, đơn vị cung cấp và trải nghiệm du lịch nông nghiệp địa phương.",
      },
      { property: "og:title", content: "Bình Mỹ FarmGo — Nông sản và du lịch nông nghiệp" },
      {
        property: "og:description",
        content:
          "Nguyên mẫu nền tảng quảng bá, kết nối tiêu thụ nông sản và du lịch nông nghiệp tại Bình Mỹ.",
      },
    ],
  }),
  component: Home,
});

const problems = [
  "Thông tin về nông sản và điểm mua còn phân tán, khó tra cứu.",
  "Người mua và khách tham quan khó tìm thông tin sản phẩm, giá tham khảo và nơi mua phù hợp.",
  "Hoạt động quảng bá nông sản chưa được kết nối rõ ràng với trải nghiệm du lịch nông nghiệp địa phương.",
];

const upgradedFeatures = [
  {
    title: "Đơn hàng qua Zalo & SMS",
    description:
      "Yêu cầu mua được lưu vào hệ thống và tách theo nhà cung cấp. Với đơn vị đã xác minh, hệ thống ưu tiên thông báo qua Zalo OA và có thể chuyển qua SMS khi cổng SMS được cấu hình.",
    icon: BellRing,
    to: "/dat-mua" as const,
    action: "Gửi yêu cầu mua",
    tone: "border-emerald-300 bg-emerald-50/70",
  },
  {
    title: "Thanh toán & QR động",
    description:
      "Sau khi nhà cung cấp xác nhận giá và phí giao, khách tra cứu bằng mã yêu cầu để nhận VietQR đúng số tiền và nội dung chuyển khoản của đơn.",
    icon: QrCode,
    to: "/dat-mua" as const,
    action: "Tra cứu & thanh toán",
    tone: "border-amber-300 bg-amber-50/70",
  },
  {
    title: "Bản đồ tương tác",
    description:
      "Lọc các địa điểm đã xác minh theo 4 nhóm: điểm bán nông sản, nhà vườn, điểm trải nghiệm nông nghiệp và điểm nhận hàng.",
    icon: MapPinned,
    to: "/ban-do" as const,
    action: "Mở bản đồ",
    tone: "border-sky-300 bg-sky-50/70",
  },
];

const quickExperiences = [
  "Tham quan vườn.",
  "Hái trái cây.",
  "Chèo xuồng/cano.",
  "Làm bánh cùng người dân.",
  "Thưởng thức và mua nông sản.",
];

function Home() {
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="relative">
        <img
          src={heroImage}
          alt="Vườn rau và kênh rạch ven sông tại Bình Mỹ"
          width={1600}
          height={912}
          className="h-[52vh] min-h-72 w-full object-cover sm:h-[60vh]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/75 via-foreground/45 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="max-w-2xl text-background">
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
                Khám phá đặc sản và du lịch nông nghiệp Bình Mỹ
              </h1>
              <p className="mt-4 text-sm sm:text-base">
                Bình Mỹ FarmGo giúp người dùng khám phá nông sản địa phương, tìm hiểu nguồn
                gốc, giá tham khảo, đơn vị cung cấp và kết hợp mua sắm với trải nghiệm du lịch
                nông nghiệp tại Bình Mỹ.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/san-pham"
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Khám phá nông sản
                </Link>
                <Link
                  to="/du-lich"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Khám phá Bình Mỹ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-linear-to-br from-sky-50 via-background to-emerald-50 py-14">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <ShieldCheck className="h-4 w-4" />
                Phiên bản sau cải tiến
              </div>
              <h2 className="mt-3 text-2xl font-bold sm:text-4xl">Hệ thống Bình Mỹ FarmGo sau cải tiến</h2>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
                Ba nâng cấp chính được triển khai theo hướng của slide: thông báo đơn hàng, thanh toán QR động và bản đồ lọc địa điểm đã xác minh.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {upgradedFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`group rounded-3xl border p-5 shadow-sm transition-transform hover:-translate-y-1 ${feature.tone}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  <Link
                    to={feature.to}
                    hash={feature.title.startsWith("Thanh toán") ? "tra-cuu" : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    {feature.action}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Vì sao cần Bình Mỹ FarmGo?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem}
              className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground"
            >
              {problem}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Nông sản nổi bật</h2>
          <Link to="/san-pham" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả nông sản
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-sidebar py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Trải nghiệm du lịch nông nghiệp</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {quickExperiences.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.slice(0, 3).map((experience) => (
              <article
                key={experience.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={experience.image}
                  alt={experience.imageAlt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-4/3 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{experience.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <Link
            to="/du-lich"
            className="mt-6 inline-flex rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Xem tất cả trải nghiệm
          </Link>
        </div>
      </section>
    </div>
  );
}
