import { createFileRoute, Link } from "@tanstack/react-router";
import { experiences } from "@/data/experiences";

export const Route = createFileRoute("/du-lich")({
  head: () => ({
    meta: [
      { title: "Du lịch nông nghiệp Bình Mỹ — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Các hoạt động trải nghiệm nông nghiệp, sông nước và mua sắm nông sản trong hành trình tại Bình Mỹ.",
      },
      { property: "og:title", content: "Du lịch nông nghiệp Bình Mỹ" },
      {
        property: "og:description",
        content: "Tham quan vườn, chèo xuồng, làm bánh và mua nông sản tại Bình Mỹ.",
      },
    ],
  }),
  component: TourismPage,
});

function TourismPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Du lịch nông nghiệp Bình Mỹ</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Khám phá các hoạt động trải nghiệm nông nghiệp, sông nước và mua sắm nông sản trong hành
        trình tại Bình Mỹ.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {experiences.map((experience, index) => (
          <article
            key={experience.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <img
              src={experience.image}
              alt={experience.imageAlt}
              loading="lazy"
              width={1024}
              height={768}
              className="aspect-4/3 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">
                  {index + 1}. {experience.title}
                </h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{experience.description}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
        Nội dung trải nghiệm được xây dựng theo định hướng du lịch nông nghiệp tại Bình Mỹ và
        dùng để minh họa cho nguyên mẫu. Lịch trình thực tế cần được xác nhận trước khi triển
        khai.
      </p>

      <Link
        to="/san-pham"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Chọn nông sản để gửi yêu cầu mua
      </Link>
    </div>
  );
}
