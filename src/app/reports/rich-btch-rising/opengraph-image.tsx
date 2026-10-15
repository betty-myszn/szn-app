import { offerOgImage, OG_SIZE } from "@/lib/offer-og";

export const alt = "Rich B*tch Rising, the MY SZN money report";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return offerOgImage("rich-btch-rising");
}
