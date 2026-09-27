import { useId } from "react";
import { garmentPalettes, type Garment } from "../utils/wardrobe";

export const garmentFrame = (g: Garment): string => {
  if (g.slot === "top") return "82 148 196 166";
  if (g.slot === "outer") return "77 139 206 214";
  if (g.slot === "dress") return "83 153 194 205";
  if (g.slot === "bottom")
    return g.shape === "skirt" ? "109 267 142 97" : "128 268 104 166";
  if (g.slot === "head") return "96 12 168 104";
  if (g.slot === "shoes") return "118 374 124 78";
  if (g.shape === "umbrella") return "227 93 130 245";
  if (g.shape === "scarf") return "145 165 80 96";
  return "77 268 205 48";
};

/** The exact same artwork is used in the wardrobe and on the doll. */
export function GarmentLayer({ garment: g }: { garment: Garment }) {
  const uid = useId();
  const colors = garmentPalettes[g.color];
  const s = g.shape;
  const outer = g.slot === "outer";
  const long = (g.slot === "top" && s !== "tee") || outer;
  const hem = s === "parka" || s === "coat" ? 332 : outer ? 316 : 294;
  const torso = long
    ? `M148 174Q133 169 123 182Q108 215 94 272Q91 282 104 285L116 281 139 218 137 ${hem}Q180 ${hem + 14} 223 ${hem}L221 218 244 281 256 285Q269 282 266 272Q252 215 237 182Q227 169 212 174Q180 189 148 174Z`
    : "M148 174Q132 169 122 183L108 215Q118 228 134 229L138 294Q180 307 222 294L226 229Q241 228 252 215L238 183Q228 169 212 174Q180 189 148 174Z";
  const stroke = colors[2];
  return (
    <g
      data-item={g.id}
      data-zone={g.slot}
      className="dress-layer"
      fill={`url(#${uid}-cloth)`}
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${uid}-cloth`} x1="0" y1="0" x2="1" y2=".4">
          <stop stopColor={colors[2]} />
          <stop offset=".13" stopColor={colors[1]} />
          <stop offset=".36" stopColor={colors[0]} />
          <stop offset=".65" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow
            dy="2"
            stdDeviation="1.6"
            floodColor={stroke}
            floodOpacity=".28"
          />
        </filter>
        <pattern
          id={`${uid}-knit`}
          width="5"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="m1 1 1.5 2L4 1"
            fill="none"
            stroke="#fff"
            strokeWidth=".7"
            opacity=".2"
          />
        </pattern>
        <clipPath id={`${uid}-torso`}>
          <path d={torso} />
        </clipPath>
      </defs>
      <g filter={`url(#${uid}-soft)`}>
        {(g.slot === "top" || outer) && (
          <>
            {["hoodie", "raincoat", "parka", "coat"].includes(s) && (
              <path
                d="M144 184Q130 147 180 149Q230 147 216 184L198 202H162Z"
                stroke={stroke}
                strokeWidth="1.5"
              />
            )}
            <path d={torso} stroke={stroke} strokeWidth=".65" />
            <g clipPath={`url(#${uid}-torso)`}>
              {(s === "sweater" || s === "coat") && (
                <rect
                  x="80"
                  y="165"
                  width="200"
                  height="180"
                  fill={`url(#${uid}-knit)`}
                />
              )}
              {g.detail === "stripes" && (
                <path
                  d="M100 214h160M100 239h160M100 264h160"
                  stroke="#fff8e4"
                  strokeWidth="9"
                  opacity=".8"
                />
              )}
              {g.detail === "quilt" &&
                [204, 230, 257, 285, 313].map((y) => (
                  <path
                    key={y}
                    d={`M90 ${y}Q180 ${y + 19} 270 ${y}`}
                    stroke={stroke}
                    strokeWidth="2"
                    opacity=".4"
                    fill="none"
                  />
                ))}
              <path
                d={`M146 212Q143 252 146 ${hem - 7}M213 218Q217 264 214 ${hem - 5}`}
                stroke="#fff"
                strokeWidth="3"
                opacity=".22"
                fill="none"
              />
            </g>
            <path
              d={`M149 179Q180 204 211 179M141 ${hem - 6}Q180 ${hem + 4} 219 ${hem - 6}`}
              stroke={stroke}
              opacity=".45"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M151 178Q180 198 209 178"
              stroke={colors[0]}
              strokeWidth="4"
              fill="none"
            />
            {long && (
              <path
                d="m97 271 19 6m128 0 19-6"
                stroke={stroke}
                strokeWidth="6"
                opacity=".45"
              />
            )}
            {outer && (
              <>
                <path
                  d={`M180 185v${hem - 181}`}
                  stroke={stroke}
                  strokeWidth="3"
                />
                <path
                  d="M151 177l15 23 14-14 14 14 15-23"
                  stroke={colors[0]}
                  strokeWidth="2"
                  fill="none"
                />
                {[213, 239, 265, 291].map((y) => (
                  <g key={y}>
                    <circle cx="181" cy={y} r="3.2" fill="#fff1c5" />
                    <circle cx="181" cy={y} r="1" fill={stroke} />
                  </g>
                ))}
                <path
                  d="M143 262h23v27q-11 7-23 0ZM194 262h23v27q-11 7-23 0Z"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="1.5"
                />
                <path
                  d="M144 263h21M195 263h21"
                  stroke={colors[0]}
                  strokeWidth="3"
                />
              </>
            )}
            {s === "parka" && (
              <path
                d="M145 177Q132 149 180 153Q228 149 215 177"
                fill="none"
                stroke="#f5e7cd"
                strokeWidth="10"
                strokeLinecap="round"
              />
            )}
            {s === "hoodie" && (
              <>
                <path
                  d="M162 252h36l10 31q-28 8-56 0Z"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="1.4"
                />
                <path
                  d="M166 191v30m28-30v30"
                  stroke="#fff3da"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </>
        )}
        {g.slot === "bottom" && (
          <>
            <path
              d={
                s === "skirt"
                  ? "M139 279Q180 273 221 279L242 345Q180 364 118 345Z"
                  : s === "shorts"
                    ? "M139 279Q180 273 221 279L221 350Q203 356 185 350L180 316 175 350Q157 356 139 350Z"
                    : s === "leggings"
                      ? "M141 279Q180 274 219 279L215 420Q202 426 190 421L180 317 170 421Q157 426 145 420Z"
                      : "M138 279Q180 273 222 279L220 421Q202 429 185 421L180 321 175 421Q157 429 140 421Z"
              }
              stroke={stroke}
              strokeWidth=".8"
            />
            <path
              d="M141 289Q180 284 219 289"
              stroke={stroke}
              strokeWidth="4"
              opacity=".5"
            />
            {s === "skirt" ? (
              <path
                d="M149 299l-15 42m77-42 15 42M180 300v49"
                stroke={colors[0]}
                strokeWidth="3"
                opacity=".7"
              />
            ) : (
              <>
                <path
                  d="M180 286v28M144 296q8 12 21 2M216 296q-8 12-21 2"
                  fill="none"
                  stroke={s === "jeans" ? "#efcf91" : stroke}
                  strokeWidth="1.5"
                />
                <path
                  d={
                    s === "shorts"
                      ? "M143 345h29m16 0h29"
                      : "M144 414h28m16 0h28"
                  }
                  stroke={colors[0]}
                  strokeWidth="4"
                />
                <path
                  d={
                    s === "shorts"
                      ? "M147 316v20m66-20v20"
                      : "M147 320l3 81m63-81-3 81"
                  }
                  stroke={colors[0]}
                  strokeWidth="3"
                  opacity=".35"
                />
                <circle cx="180" cy="291" r="2.3" fill="#e9d5a3" />
              </>
            )}
          </>
        )}
        {g.slot === "dress" && (
          <>
            {s === "long-dress" && (
              <path d="M148 174Q134 171 123 183L94 272Q96 284 113 282L143 212H217L247 282Q264 284 266 272L237 183Q226 171 212 174Z" />
            )}
            <path
              d="M148 174Q180 194 212 174L226 199 208 239Q216 287 244 337Q180 362 116 337Q144 287 152 239L134 199Z"
              stroke={stroke}
              strokeWidth=".7"
            />
            <path
              d="M148 179Q180 201 212 179M152 239Q180 247 208 239"
              fill="none"
              stroke={colors[0]}
              strokeWidth="4"
            />
            <path
              d="M154 256Q146 306 132 334M206 256Q214 306 228 334M173 259l-5 82M187 259l5 82"
              fill="none"
              stroke={colors[0]}
              strokeWidth="3"
              opacity=".45"
            />
            {g.detail === "dots" &&
              [268, 290, 312, 334].map((y, i) => (
                <g key={y} fill="#fff6e3">
                  {[153, 180, 207].map((x) => (
                    <circle key={x} cx={x + (i % 2 ? 4 : 0)} cy={y} r="3.5" />
                  ))}
                </g>
              ))}
            <path
              d="M179 242q-22-19-23-1t23 3m2-2q22-19 23-1t-23 3"
              fill={colors[2]}
            />
            <circle cx="180" cy="242" r="4" fill={colors[0]} />
          </>
        )}
        {g.slot === "head" && (
          <>
            {s === "sunhat" ? (
              <>
                <ellipse cx="180" cy="87" rx="77" ry="17" />
                <path d="M133 79l10-42q37-13 74 0l10 42q-47 15-94 0Z" />
                <path
                  d="M136 68q44 14 88 0"
                  stroke="#df967d"
                  strokeWidth="10"
                  fill="none"
                />
              </>
            ) : s === "beanie" ? (
              <>
                <path d="M122 90q-3-58 58-58t58 58Z" />
                <circle cx="180" cy="28" r="13" />
                <rect x="119" y="82" width="122" height="22" rx="10" />
                {[137, 151, 165, 180, 195, 209, 223].map((x) => (
                  <path
                    key={x}
                    d={`M${x} 59v20`}
                    stroke={colors[0]}
                    strokeWidth="3"
                    opacity=".6"
                  />
                ))}
              </>
            ) : (
              <>
                <path d="M120 94q0-56 60-56t60 56Z" />
                <path d="M141 88q62-8 109 5q9 17-17 16l-92-9Z" />
                <path d="M180 42v43" stroke={colors[0]} strokeWidth="2" />
              </>
            )}
          </>
        )}
        {g.slot === "shoes" && (
          <>
            {[false, true].map((right) => (
              <g
                key={String(right)}
                transform={right ? "translate(360 0) scale(-1 1)" : undefined}
              >
                <path
                  d={
                    ["boots", "rainboots"].includes(s)
                      ? "M142 382q17-5 33 0v58q-23 12-48 2-7-10 15-18Z"
                      : "M142 421q18-8 33 0v19q-23 12-48 2-7-12 15-16Z"
                  }
                  stroke={stroke}
                  strokeWidth=".8"
                />
                <path
                  d="M128 439q23 9 45-1"
                  stroke="#fff4da"
                  strokeWidth="5"
                  fill="none"
                />
                {["boots", "rainboots"].includes(s) && (
                  <path d="M144 387h28" stroke={colors[0]} strokeWidth="5" />
                )}
                {s === "sneakers" && (
                  <path
                    d="m144 423 18 3m-22 3 19 3"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                )}
                {s === "sandals" && (
                  <>
                    <path d="M140 428h16v7h-16Z" fill="#ecc39e" />
                    <path d="M135 438h35" stroke={colors[0]} strokeWidth="3" />
                  </>
                )}
              </g>
            ))}
          </>
        )}
        {s === "umbrella" && (
          <>
            <path
              d="M292 174v139q0 21-16 16"
              fill="none"
              stroke="#a77b47"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="M231 177q5-69 61-69t61 69q-16-12-30 0-16-12-31 0-16-12-31 0-15-12-30 0Z" />
            <path
              d="M261 177q5-49 31-69 27 20 31 69-16-12-31 0-16-12-31 0Z"
              fill="#f3cb6f"
            />
            <path
              d="M292 100v9"
              stroke="#a77b47"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}
        {s === "scarf" && (
          <>
            <path d="m181 193 23-8 15 65q-13 7-25 2Z" />
            <rect x="151" y="173" width="58" height="25" rx="12" />
            <path
              d="m194 224 19-5m-16 19 19-5"
              stroke="#ffe9b9"
              strokeWidth="6"
            />
          </>
        )}
        {s === "mittens" &&
          [false, true].map((right) => (
            <g
              key={String(right)}
              transform={right ? "translate(360 0) scale(-1 1)" : undefined}
            >
              <path d="M85 278q11-7 22 2l4 12q9-3 6 6-11 21-26 12-15-5-10-21Z" />
              <path d="m86 279 20 3" stroke={colors[0]} strokeWidth="5" />
            </g>
          ))}
      </g>
    </g>
  );
}
