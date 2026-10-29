/** Round award-style badge with a laurel wreath drawn in SVG. */
const R = 64;
const pt = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a) };
};

function Branch({ flip = false }: { flip?: boolean }) {
  // Left half: from bottom (115°) up to the top (245°), leaves every 18°.
  const start = pt(112);
  const end = pt(248);
  const leaves = Array.from({ length: 7 }, (_, i) => 122 + i * 18);
  return (
    <g transform={flip ? "translate(200 0) scale(-1 1)" : undefined}>
      <path d={`M${start.x} ${start.y} A${R} ${R} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      {leaves.map((deg) => {
        const p = pt(deg);
        const tangent = deg + 90; // direction the stem is heading (upwards)
        return (
          <g key={deg} transform={`translate(${p.x} ${p.y}) rotate(${tangent})`}>
            <ellipse cx="5" cy="-6" rx="3.2" ry="8" fill="#fff" transform="rotate(35 5 -6)" />
            <ellipse cx="5" cy="6" rx="3.2" ry="8" fill="#fff" transform="rotate(-35 5 6)" />
          </g>
        );
      })}
    </g>
  );
}

export function AwardBadge({ top, value }: { top: string; value: string }) {
  return (
    <div className="relative grid size-[170px] shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden>
        <Branch />
        <Branch flip />
      </svg>
      <div className="relative max-w-[92px] text-center">
        <p className="oswald text-[11px] leading-tight !tracking-[0.2em]">{top}</p>
        <p className="oswald mt-1 text-[32px] font-medium leading-none !tracking-normal text-sun">{value}</p>
      </div>
    </div>
  );
}
