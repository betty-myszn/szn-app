import { redirect } from "next/navigation";

// The astro map is members only (no free version, Betty 25 Nov 2026). Old links, including the
// footer on share cards made before this, land on the Coven.
export default function PowerPlacesRedirect() {
  redirect("/baddie-coven");
}
