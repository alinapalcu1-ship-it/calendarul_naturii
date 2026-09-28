export const weekdays = [
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
  "Duminică",
];
export const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function parseDate(value: string) {
  return new Date(`${value}T12:00:00`);
}
export function dateText(value: string, language: "ro" | "de" = "ro") {
  return parseDate(value).toLocaleDateString(language === "de" ? "de-DE" : "ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function makeDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(d, new Date(y, m + 1, 0).getDate())).padStart(2, "0")}`;
}
