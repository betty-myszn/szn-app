import { permanentRedirect } from "next/navigation";

// The Gemini Full Moon report (24 Nov 2026) is closed: the moon has passed and its Stripe Payment Link
// (plink_1Uf4EhJ6s9fRhiJo914NM8b2) was deactivated on 25 Nov 2026. Old links land on the reports page.
export default function GeminiFullMoonClosed() {
  permanentRedirect("/reports");
}
