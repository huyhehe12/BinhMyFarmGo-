import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Database, MapPinned, QrCode, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Giới thiệu — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Mục tiêu, cách hoạt động và các nâng cấp của Bình Mỹ FarmGo: lưu yêu cầu mua, thông báo nhà cung cấp, VietQR và bản đồ địa điểm đã xác minh.",
      },
      { property: "og:title", content: "Giới thiệu Bình Mỹ FarmGo" },
      {
        property: "og:description",
        content:
          "Nền tảng hỗ trợ quảng bá, kết nối tiêu thụ nông sản và du lịch nông nghiệp tại Bình Mỹ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const goals = [
  "Hỗ trợ quảng bá nông sản Bình Mỹ và các đơn vị cung cấp địa phương.",
  "Giúp người dùng tra cứu sản phẩm, nguồn gốc, giá tham khảo và điểm mua thuận tiện hơn.",
  "Kết nối yêu cầu mua với nhà cung cấp và theo dõi trạng thái xử lý.",
  "Gắn tiêu thụ nông sản với hoạt động du lịch nông nghiệp tại Bình Mỹ.",
];

const steps = [
  "Người dùng xem nông sản, đơn vị cung cấp và trải nghiệm du lịch.",
  "Chọn sản phẩm, nhập thông tin và gửi yêu cầu mua.",
  "Hệ thống lưu yêu cầu, tách theo nhà cung cấp và tạo mã BMFG để tra cứu.",
  "Nhà cung cấp đã xác minh có thể nhận thông báo qua Zalo OA; hệ thống hỗ trợ SMS dự phòng khi cổng SMS được cấu hình.",
  "Nhà cung cấp xác nhận giá và phí giao trong trang quản trị.",
  "Khách tra cứu mã yêu cầu; nếu đủ điều kiện, hệ thống tạo VietQR động đúng số tiền và nội dung chuyển khoản.",
];

const currentFeatures = [
  {
    title: "Cơ sở dữ liệu & quản trị",
    description: "Lưu yêu cầu mua, sản phẩm trong đơn, trạng thái xử lý, nhà cung cấp và địa điểm trên Supabase.",
    icon: Database,
  },
  {
    title: "Zalo OA & SMS",
    description: "Tự động thông báo yêu cầu mới đến nhà cung cấp đã xác minh; SMS đóng vai trò kênh dự phòng khi được cấu hình.",
    icon: BellRing,
  },
  {
    title: "Thanh toán QR động",
    description: "Sau khi đơn được xác nhận, khách có thể nhận VietQR theo đúng số tiền và mã yêu cầu khi tra cứu.",
    icon: QrCode,
  },
  {
    title: "Bản đồ có bộ lọc",
    description: "Chỉ hiển thị dữ liệu địa điểm đã xác minh và hỗ trợ lọc theo điểm bán, nhà vườn, trải nghiệm và điểm nhận hàng.",
    icon: MapPinned,
  },
];

const roadmap = [
  "Bổ sung thêm dữ liệu thực tế đã xác minh từ hộ sản xuất và đơn vị cung cấp.",
  "Bổ sung thêm địa điểm và tọa độ chính xác trên bản đồ.",
  "Hoàn thiện kết nối Zalo OA và cổng SMS bằng tài khoản vận hành thực tế.",
  "Chuẩn hóa thông tin ngân hàng đã xác minh của từng nhà cung cấp để dùng VietQR.",
  "Tích hợp đối tác giao nhận và theo dõi giao hàng khi triển khai thương mại.",
  "Đặt mã QR tại điểm du lịch/điểm bán để mở nhanh trang sản phẩm hoặc bản đồ.",
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" />
          Phiên bản sau cải tiến
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Giới thiệu Bình Mỹ FarmGo</h1>
        <p className="mt-4 text-muted-foreground">
          Bình Mỹ FarmGo là nền tảng thử nghiệm hỗ trợ quảng bá và kết nối tiêu thụ nông sản tại
          Bình Mỹ, đồng thời gắn hoạt động mua sắm với trải nghiệm du lịch nông nghiệp địa phương.
          Phiên bản hiện tại đã bổ sung lưu yêu cầu mua, quản trị, thông báo nhà cung cấp, thanh
          toán QR theo đơn và bản đồ lọc địa điểm đã xác minh.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Các nâng cấp chính</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {currentFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Mục tiêu</h2>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          {goals.map((goal) => (
            <li key={goal} className="flex gap-2">
              <span aria-hidden className="text-primary">•</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Cách hệ thống hoạt động</h2>
        <ol className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/dat-mua" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Thử quy trình đặt mua
          </Link>
          <Link to="/ban-do" className="rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary">
            Xem bản đồ
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Hướng phát triển tiếp theo</h2>
        <ul className="mt-4 grid gap-3 text-muted-foreground sm:grid-cols-2">
          {roadmap.map((item) => (
            <li key={item} className="rounded-xl border border-border bg-card p-4 text-sm leading-6">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 rounded-xl border border-border bg-secondary p-5 text-sm text-secondary-foreground">
        Lưu ý: Đây vẫn là dự án thử nghiệm học tập. Một số sản phẩm, giá, nhà cung cấp, tài khoản
        ngân hàng và địa điểm có thể là dữ liệu minh họa. Chỉ dữ liệu đã được xác minh mới nên dùng
        cho vận hành thực tế và thanh toán.
      </p>
    </div>
  );
}
