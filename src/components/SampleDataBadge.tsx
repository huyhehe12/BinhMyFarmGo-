export function SampleDataBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground ${className}`}
    >
      Dữ liệu minh họa
    </span>
  );
}
