"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID, trackPageView } from "@/lib/analytics";

/**
 * The consent bootstrap, as a string because it has to run as a classic inline script before
 * gtag.js rather than as React code after hydration. Two things depend on that ordering:
 *
 *   1. Consent Mode only honours a "default" command issued BEFORE the library loads. Set it late
 *      and gtag.js has already decided it may write cookies, which is exactly the outcome the
 *      banner exists to prevent.
 *   2. Reading her stored choice here, synchronously, means a returning visitor who already
 *      accepted is measured properly from the very first hit, with no gap while React boots.
 *
 * wait_for_update buys gtag 500ms to hear a consent update before it gives up and sends the first
 * hit cookieless, which covers the returning-visitor race on a slow device.
 */
function consentBootstrap(measurementId: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var stored = null;
try { stored = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}); } catch (e) {}
gtag('consent', 'default', {
  analytics_storage: stored === 'granted' ? 'granted' : 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });
`.trim();
}

/**
 * Fires a page_view on every client-side route change. Split into its own component purely because
 * useSearchParams opts the subtree into client-side rendering and needs a Suspense boundary above
 * it, and we don't want that boundary swallowing the whole layout.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    trackPageView(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4, wired for Consent Mode v2. Rendered once in the root layout. Renders nothing at all when no
 * measurement id is configured, so local dev and preview builds stay out of the production
 * property without needing a separate code path.
 */
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="ga-consent-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentBootstrap(GA_MEASUREMENT_ID) }}
      />
      <Script
        id="ga-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
