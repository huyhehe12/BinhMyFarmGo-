import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import { mapConfig } from "@/lib/map-config";
import { listLocations } from "@/lib/farmgo.functions";

export const Route = createFileRoute("/ban-do")({
  head: () => ({
    meta: [
      { title: "Bản đồ khám phá Bình Mỹ — Bình Mỹ FarmGo" },
      {
        name: "description",
        content:
          "Khám phá bản đồ khu vực Bình Mỹ, TP.HCM. Thông tin điểm bán nông sản và điểm trải nghiệm được cập nhật sau khi xác minh.",
      },
      { property: "og:title", content: "Bản đồ khám phá Bình Mỹ" },
      {
        property: "og:description",
        content:
          "Khám phá khu vực Bình Mỹ và tìm thông tin điểm bán nông sản, điểm tham quan tại địa phương.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: () => listLocations(),
  errorComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-12">Không tải được bản đồ, vui lòng thử lại.</div>
  ),
  notFoundComponent: () => <div className="mx-auto max-w-6xl px-4 py-12">Không tìm thấy.</div>,
  component: MapPage,
});

const filters = [
  { id: "all", label: "Tất cả" },
  { id: "diem_ban", label: "Điểm bán nông sản" },
  { id: "nha_vuon", label: "Nhà vườn" },
  { id: "trai_nghiem", label: "Điểm trải nghiệm nông nghiệp" },
  { id: "diem_nhan_hang", label: "Điểm nhận hàng" },
] as const;
const catLabel = Object.fromEntries(filters.map((f) => [f.id, f.label])) as Record<string, string>;

function MapPage() {
  const { locations, error } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shown = useMemo(
    () => locations.filter((l) => filter === "all" || l.category === filter),
    [locations, filter],
  );
  const selected = locations.find((l) => l.id === selectedId) ?? null;
  const embed = selected?.embed_url ?? mapConfig.embedSrc;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary">
        <MapPinned className="h-4 w-4" />
        Bản đồ sau cải tiến
      </div>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Bản đồ tương tác Bình Mỹ</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Lọc và chọn các địa điểm đã xác minh gồm điểm bán nông sản, nhà vườn, điểm trải nghiệm
        nông nghiệp và điểm nhận hàng. Khi chọn một địa điểm, bản đồ sẽ chuyển tới vị trí tương ứng.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Lọc địa điểm">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setSelectedId(null);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-label="Bản đồ khu vực Bình Mỹ">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {embed ? (
              <iframe
                key={embed}
                src={embed}
                title={
                  selected
                    ? `Bản đồ vị trí ${selected.name} trên Google Maps`
                    : "Bản đồ khu vực Bình Mỹ, TP.HCM trên Google Maps"
                }
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="aspect-square w-full border-0 sm:aspect-video"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center p-6 text-center text-sm text-muted-foreground sm:aspect-video">
                Bản đồ đang cập nhật
              </div>
            )}
            <div className="space-y-3 p-4">
              {selected ? (
                <div>
                  <p className="text-xs text-muted-foreground">{catLabel[selected.category]}</p>
                  <p className="text-lg font-semibold">{selected.name}</p>
                  {selected.address && <p className="text-sm">{selected.address}</p>}
                  {selected.contact && (
                    <p className="text-sm text-muted-foreground">Liên hệ: {selected.contact}</p>
                  )}
                  {!selected.embed_url && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Địa điểm này chưa có bản đồ nhúng, bản đồ đang hiển thị khu vực Bình Mỹ.
                    </p>
                  )}
                </div>
              ) : null}
              <a
                href={selected?.maps_url ?? mapConfig.viewOnGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Xem trên Google Maps
              </a>
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="ml-2 text-sm text-muted-foreground hover:underline"
                >
                  Về bản đồ khu vực
                </button>
              )}
            </div>
          </div>
        </section>

        <section aria-label="Danh sách địa điểm" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{catLabel[filter]}</h2>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {shown.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Danh sách địa điểm đang cập nhật</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {shown.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(l.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      selectedId === l.id ? "border-primary bg-secondary" : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{l.name}</p>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Đã xác minh
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{catLabel[l.category]}</p>
                    {l.address && <p className="mt-1 text-sm text-muted-foreground">{l.address}</p>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-8 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
        Chỉ địa điểm được quản trị đánh dấu “đã xác minh” mới hiển thị. Bộ lọc giúp thu hẹp danh
        sách; chọn một địa điểm để xem bản đồ, địa chỉ và liên kết Google Maps tương ứng.
      </p>
    </div>
  );
}
