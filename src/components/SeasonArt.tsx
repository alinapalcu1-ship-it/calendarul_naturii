const files: Record<string, string> = {
  season: "four-seasons",
  Primăvara: "spring",
  Vara: "summer",
  Toamna: "autumn",
  Iarna: "winter",
};
export function SeasonArt({
  name,
  size = 140,
}: {
  name: string;
  size?: number;
}) {
  return (
    <img
      className="season-art"
      src={`${import.meta.env.BASE_URL}illustrations/seasons/${files[name] || "four-seasons"}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
    />
  );
}
