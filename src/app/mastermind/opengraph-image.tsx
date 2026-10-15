import { offerOgImage, OG_SIZE } from "@/lib/offer-og";

export const alt = "The MY SZN Mastermind";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return offerOgImage("mastermind");
}
