// GA4 + Google Consent Mode v2. Everything analytics-related goes through this module so there is
// exactly one place that knows the measurement id, the consent storage key, and the event names.
//
// The consent contract, in short: nothing is measured until she says yes. The inline bootstrap in
// <Analytics /> sets all consent categories to "denied" before gtag.js loads, so GA4's first hit
// carries no cookies and no identifiers. Accepting flips analytics_storage to "granted" via a
// consent update, which is the signal GA4 uses to start writing its _ga cookie. Declining leaves
// the defaults in place, so GA4 stays in cookieless mode: we still get a rough, unattributed hit
// count, we do not get a person.

/** Public GA4 measurement id, e.g. "G-XXXXXXXXXX". Empty in environments that haven't set it. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/** localStorage key holding her choice. Read by the inline bootstrap script too, keep in sync. */
export const CONSENT_STORAGE_KEY = "myszn-cookie-consent";

export type ConsentChoice = "granted" | "denied";

// gtag pushes its arguments object onto dataLayer, hence the loose signature. Declaring it here
// rather than in a global .d.ts keeps the type next to the only code that calls it.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** True once a measurement id exists and gtag.js has attached itself. */
function gtagReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function" && !!GA_MEASUREMENT_ID;
}

/**
 * Her stored choice, or null if she hasn't answered yet (which is what makes the banner show).
 * Wrapped in try/catch because Safari private mode throws on localStorage access rather than
 * returning null, and an analytics banner must never be the thing that breaks a page.
 */
export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Persist her choice and tell GA4 about it in the same breath. The consent *update* is what
 * actually changes GA4's behaviour mid-session: it doesn't need a reload, gtag re-evaluates
 * storage access immediately and (on grant) replays the hits it buffered while waiting.
 */
export function setConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked. The update below still applies for this session, she'll just be asked again
    // next visit, which is the safe direction to fail in.
  }

  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    // We don't run ads yet. These stay denied on purpose: granting ad storage we don't use would
    // be collecting consent for a purpose we can't name in the privacy policy.
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Event name the footer link dispatches to re-open the banner. UK/EU rules require withdrawing
 * consent to be as easy as giving it, so a "cookie settings" link has to exist on every page.
 * A window event rather than shared state keeps the banner out of every page's component tree.
 */
export const OPEN_CONSENT_EVENT = "myszn:open-cookie-settings";

/** Re-open the cookie banner so she can change a previous answer. */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

/**
 * Send a GA4 event. A no-op when gtag is absent (consent bootstrap not yet run, ad blocker, or no
 * measurement id configured in this environment), so call sites never need to guard.
 */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (!gtagReady()) return;
  window.gtag?.("event", event, params);
}

/**
 * Manual page_view. Required because gtag.js only auto-fires a page_view on hard load, and this is
 * a client-routed app where most navigation never reloads the document. <Analytics /> disables the
 * automatic one (send_page_view: false) so every view, first and subsequent, comes from here and
 * they can't double-count each other.
 */
export function trackPageView(path: string): void {
  if (!gtagReady()) return;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/* ── The funnel ──
   Named constants rather than inline strings, because a typo'd event name in GA4 doesn't error,
   it silently creates a second, near-identical event that splits your funnel in half and is not
   retroactively fixable. GA4's own recommended names (sign_up, begin_checkout, purchase,
   generate_lead) are used where one fits, since those unlock GA4's built-in reports for free. */
export const EVENTS = {
  /** Free chart calculator submitted, the top of the funnel we actually control. */
  CHART_STARTED: "chart_started",
  /** Chart came back successfully. Carries sun/moon/rising for audience segmentation. */
  CHART_COMPLETED: "chart_completed",
  /** Calculation failed. If this climbs, the funnel is leaking on a bug, not on copy. */
  CHART_FAILED: "chart_failed",
  /** Email captured anywhere (free chart opt-in, waitlist). GA4 recommended name. */
  LEAD: "generate_lead",
  /** The non-refundable agreement checkbox, the last friction point before money. */
  TERMS_AGREED: "checkout_terms_agreed",
  /** Clicked through to Stripe. GA4 recommended name. */
  BEGIN_CHECKOUT: "begin_checkout",
  /** Landed back on /checkout/success. GA4 recommended name. */
  PURCHASE: "purchase",
  /** Account created after paying. GA4 recommended name. */
  SIGN_UP: "sign_up",
  /** Any primary call-to-action press, with a label saying which one. */
  CTA_CLICK: "cta_click",
} as const;
