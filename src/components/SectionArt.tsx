import { SeasonArt } from "./SeasonArt";
import { useId } from "react";
const sections: Record<string, string> = {
  calendar: "0 0 443 443",
  season: "444 0 443 443",
  weather: "887 0 443 443",
  clothing: "1331 0 443 443",
  attendance: "0 445 500 442",
  emotions: "510 445 370 442",
  helper: "887 445 415 442",
  summary: "1305 445 469 442",
};

/** Per-icon frames keep neighbouring artwork outside each decorative SVG. */
export function SectionArt({
  name,
  size = 140,
}: {
  name: string;
  size?: number;
}) {
  const clip = useId();
  if (name === "season") return <SeasonArt name={name} size={size} />;
  const frame = sections[name];
  if (!frame) return null;
  const [x, y, width, height] = frame.split(" ").map(Number);
  return (
    <svg
      className="section-art"
      aria-hidden="true"
      focusable="false"
      data-section-art={name}
      width={size}
      height={size}
      viewBox={frame}
      style={{ overflow: "hidden" }}
    >
      <defs>
        <clipPath id={clip}>
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>
      </defs>
      <image
        clipPath={`url(#${clip})`}
        href={`${import.meta.env.BASE_URL}illustrations/sections/section-icons-v1.png`}
        width="1774"
        height="887"
      />
    </svg>
  );
}
