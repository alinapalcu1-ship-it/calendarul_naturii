import { useId } from "react";

const positions: Record<number, number[][]> = {
  1: [[60, 59]],
  2: [
    [37, 59],
    [83, 59],
  ],
  3: [
    [60, 32],
    [34, 78],
    [86, 78],
  ],
  4: [
    [35, 34],
    [85, 34],
    [35, 84],
    [85, 84],
  ],
  5: [
    [28, 29],
    [92, 29],
    [60, 59],
    [28, 91],
    [92, 91],
  ],
};
export function WeekdayArt({
  count,
  name,
  size,
}: {
  count: number;
  name: string;
  size: number;
}) {
  const id = useId();
  return (
    <svg
      className="storybook-art weekday-stars"
      data-illustration={name}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="30%" cy="20%" r="85%">
          <stop stopColor="#fff6bc" />
          <stop offset=".48" stopColor="#f4c75e" />
          <stop offset="1" stopColor="#c89037" />
        </radialGradient>
        <filter
          id={`${id}-shadow`}
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
        >
          <feDropShadow
            dy="2"
            stdDeviation="1.5"
            floodColor="#ad7833"
            floodOpacity=".2"
          />
        </filter>
      </defs>
      {positions[count].map(([x, y], i) => (
        <g
          key={i}
          data-count-star
          transform={`translate(${x} ${y})`}
          filter={`url(#${id}-shadow)`}
        >
          <path
            d="M0-20Q2-21 4-16L8-8 18-6Q23-5 19-1L11 7 13 18Q14 22 10 20L0 15-10 20Q-14 22-13 18L-11 7-19-1Q-23-5-18-6L-8-8-4-16Q-2-21 0-20Z"
            fill={`url(#${id})`}
            stroke="#e0ab50"
            strokeWidth=".6"
          />
          <path
            d="M-3-12-6-4-13-2"
            stroke="#fff7d5"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity=".8"
          />
        </g>
      ))}
    </svg>
  );
}
