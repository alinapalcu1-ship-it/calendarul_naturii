import { StoryArt } from "./StoryArt";
import { GarmentArt } from "./GarmentArt";
import { getGarment } from "../utils/wardrobe";
export function ClothingIcon({
  name,
  size = 76,
}: {
  name: string;
  size?: number;
}) {
  const garment = getGarment(name);
  return garment ? (
    <GarmentArt garment={garment} size={size} />
  ) : (
    <StoryArt name={name} size={size} />
  );
}
