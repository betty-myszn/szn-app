import { Cormorant_Garamond } from "next/font/google";

// LILITH's display serif, the same face as the LILITH course page, loaded only where it's used.
export const lilithSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
