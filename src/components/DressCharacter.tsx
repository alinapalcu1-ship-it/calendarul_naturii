import { useId } from "react";
import type { State } from "../types";
import { getGarment, normalizeOutfit } from "../utils/wardrobe";
import { GarmentLayer } from "./GarmentLayer";

/** Both dolls share body anchors, so every item fits either character. */
export function DressCharacter({
  variant,
  clothes,
}: {
  variant: State["mannequin"];
  clothes: string[];
}) {
  const id = useId();
  const outfit = normalizeOutfit(clothes)
    .map(getGarment)
    .filter((g) => g !== undefined);
  const layer = (slot: string) =>
    outfit
      .filter((g) => g.slot === slot)
      .map((g) => <GarmentLayer key={g.id} garment={g} />);
  const coveredArms = outfit.some(
    (g) =>
      g.slot === "outer" ||
      (g.slot === "top" && g.shape !== "tee") ||
      g.shape === "long-dress",
  );
  const skin = `url(#${id}-skin)`;
  const hair = `url(#${id}-hair)`;
  const girl = variant === "girl";
  return (
    <svg
      className="dress-character"
      viewBox="0 0 360 470"
      role="img"
      aria-label={`${girl ? "Fată" : "Băiat"} zâmbitor, îmbrăcat cu: ${outfit.map((g) => g.label).join(", ") || "hăinuțe de bază"}`}
    >
      <defs>
        <radialGradient id={`${id}-skin`} cx="35%" cy="28%" r="80%">
          <stop stopColor="#ffe6c9" />
          <stop offset=".55" stopColor="#efc49e" />
          <stop offset="1" stopColor="#c99070" />
        </radialGradient>
        <radialGradient id={`${id}-hair`} cx="35%" cy="20%" r="85%">
          <stop stopColor="#bd8757" />
          <stop offset=".45" stopColor="#875438" />
          <stop offset="1" stopColor="#452e29" />
        </radialGradient>
        <radialGradient id={`${id}-cheek`}>
          <stop stopColor="#e99885" stopOpacity=".65" />
          <stop offset="1" stopColor="#e99885" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-eye`} cx="35%" cy="25%">
          <stop stopColor="#ac875a" />
          <stop offset=".7" stopColor="#644738" />
          <stop offset="1" stopColor="#302c29" />
        </radialGradient>
        <linearGradient id={`${id}-base`}>
          <stop stopColor="#d8d2bf" />
          <stop offset=".4" stopColor="#fffbee" />
          <stop offset="1" stopColor="#d8d2bf" />
        </linearGradient>
        <linearGradient id={`${id}-shorts`}>
          <stop stopColor="#91afcb" />
          <stop offset=".4" stopColor="#d9e8f4" />
          <stop offset="1" stopColor="#9bb8d2" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-25%"
          y="-20%"
          width="150%"
          height="150%"
        >
          <feDropShadow
            dy="2"
            stdDeviation="2"
            floodColor="#72503b"
            floodOpacity=".18"
          />
        </filter>
      </defs>
      <ellipse cx="180" cy="452" rx="78" ry="9" fill="#718563" opacity=".17" />
      {outfit
        .filter((g) => g.shape === "umbrella")
        .map((g) => (
          <GarmentLayer key={g.id} garment={g} />
        ))}
      <g filter={`url(#${id}-shadow)`}>
        <path
          d="M146 288q14-12 28-1l-2 133q-1 16-15 16t-14-15ZM186 287q14-11 28 1l3 133q-1 16-14 15t-15-16Z"
          fill={skin}
        />
        <path
          d="M146 417q14-5 28 6v17q-23 11-44 1-5-9 16-15ZM186 423q14-11 28-6v9q21 6 16 15-21 10-44-1Z"
          fill={`url(#${id}-base)`}
        />
        <path
          d="M137 279q43-8 86 0l-2 64q-18 8-36 1l-5-29-5 29q-18 7-36-1Z"
          fill={`url(#${id}-shorts)`}
        />
        <path
          opacity={coveredArms ? 0 : 1}
          d="M131 181q12 5 3 29l-23 70q-3 13-12 16-19 2-13-17l24-78q9-27 21-20ZM229 181q-12 5-3 29l23 70q3 13 12 16 19 2 13-17l-24-78q-9-27-21-20Z"
          fill={skin}
        />
        <path
          d="M130 194Q133 170 159 173H201Q227 170 230 194L220 212H140Z"
          fill={skin}
        />
        <path
          d="M147 173q33 17 66 0l12 32-4 91q-41 11-82 0l-4-91Z"
          fill={`url(#${id}-base)`}
        />
        <path
          d="M148 178q32 18 64 0M140 289q40 10 80 0"
          stroke="#fffdf4"
          strokeWidth="3"
          fill="none"
        />
        {layer("bottom")}
        {layer("top")}
        {layer("dress")}
        {layer("outer")}
        {layer("shoes")}
        <ellipse cx="98" cy="290" rx="11" ry="14" fill={skin} />
        <ellipse cx="262" cy="290" rx="11" ry="14" fill={skin} />
        <path d="M169 164h22v16q-11 8-22 0Z" fill={skin} data-anatomy="neck" />
        {girl && (
          <g fill={hair}>
            <path d="M123 86q-35 7-21 47-16 18 2 36 23 4 27-33ZM237 86q35 7 21 47 16 18-2 36-23 4-27-33Z" />
            <path
              d="M112 105q-9 18 1 32m132-32q9 18-1 32"
              fill="none"
              stroke="#cf9a67"
              strokeWidth="4"
              opacity=".55"
            />
          </g>
        )}
        <ellipse cx="180" cy="105" rx="63" ry="68" fill={hair} />
        <ellipse cx="121" cy="121" rx="11" ry="15" fill={skin} />
        <ellipse cx="239" cy="121" rx="11" ry="15" fill={skin} />
        <path d="M123 92q3-42 57-42t57 42v37q-3 47-57 47t-57-47Z" fill={skin} />
        <path
          d={
            girl
              ? "M119 110q-10-58 42-67 47-13 74 28 11 16 6 39-12-17-17-39-24 28-66 16-23 15-39 23Z"
              : "M118 109q-11-45 15-58 14-20 39-12 34-20 52 7 26 10 19 61-10-9-14-32-25 20-55 9l12-15q-24 27-51 22l-17 18Z"
          }
          fill={hair}
        />
        <path
          d={
            girl
              ? "M132 76q30-39 68-18M145 83q29-3 48-18"
              : "M133 72q14-23 31-19M159 68q22-29 45-17"
          }
          fill="none"
          stroke="#d0a06c"
          strokeWidth="4"
          opacity=".45"
          strokeLinecap="round"
        />
        {girl && (
          <g fill="#db8e88">
            <path d="M119 94q-18-13-16 2t16 3q14-14 15-1t-15 1ZM241 94q18-13 16 2t-16 3q-14-14-15-1t15 1Z" />
            <circle cx="120" cy="97" r="4" fill="#f8c5aa" />
            <circle cx="240" cy="97" r="4" fill="#f8c5aa" />
          </g>
        )}
        {[153, 207].map((x) => (
          <g key={x}>
            <path
              d={`M${x - 11} 107q11-7 22 0`}
              stroke="#79513b"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx={x} cy="121" rx="12" ry="14" fill="#fffdf5" />
            <ellipse
              cx={x + 1}
              cy="123"
              rx="8.5"
              ry="10.5"
              fill={`url(#${id}-eye)`}
            />
            <ellipse cx={x + 2} cy="123" rx="4.5" ry="7" fill="#2c2926" />
            <circle cx={x - 1} cy="118" r="3.2" fill="white" />
            <circle cx={x + 5} cy="126" r="1.4" fill="white" />
            <ellipse
              cx={x - 4}
              cy="140"
              rx="18"
              ry="12"
              fill={`url(#${id}-cheek)`}
            />
          </g>
        ))}
        <path
          d="M178 125q-7 13 2 14 8 0 5-7"
          fill={skin}
          stroke="#dba17e"
          strokeWidth="1"
        />
        <path d="M163 148q17 8 34 0-3 16-17 16t-17-16Z" fill="#904b40" />
        <path d="M166 149q14 5 28 0l-3 5q-11 3-22 0Z" fill="#fffaf0" />
        <path d="M173 161q7-6 14 0" fill="#e7978b" />
      </g>
      {layer("head")}
      {outfit
        .filter((g) => g.slot === "accessory" && g.shape !== "umbrella")
        .map((g) => (
          <GarmentLayer key={g.id} garment={g} />
        ))}
    </svg>
  );
}
