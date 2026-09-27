import { GarmentLayer, garmentFrame } from "./GarmentLayer";
import type { Garment } from "../utils/wardrobe";
export function GarmentArt({
  garment,
  size = 94,
}: {
  garment: Garment;
  size?: number;
}) {
  return (
    <svg
      className="garment-art"
      width={size}
      height={size}
      viewBox={garmentFrame(garment)}
      aria-hidden="true"
      data-garment-art={garment.id}
    >
      <GarmentLayer garment={garment} />
    </svg>
  );
}
