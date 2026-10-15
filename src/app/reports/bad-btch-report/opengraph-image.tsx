import { offerOgImage, OG_SIZE } from "@/lib/offer-og";

export const alt = "The Bad B*tch Report, the MY SZN confidence report";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return offerOgImage("bad-btch-report");
}
