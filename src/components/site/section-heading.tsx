/** Big slanted title (“Rooms”) with a small spaced label under it (“CHOOSE YOUR BED”). */
export function SectionHeading({
  title,
  label,
  center = true,
  light = false,
  className = "",
}: {
  title: string;
  label?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <h2 className={`display text-[clamp(3rem,6.5vw,4.6rem)] ${light ? "text-white" : "text-brand"}`}>{title}</h2>
      {label && <p className={`label-caps mt-4 ${light ? "text-white/80" : "text-muted"}`}>{label}</p>}
    </div>
  );
}
