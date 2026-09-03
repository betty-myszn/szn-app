/**
 * The emailed "manage or cancel" link. What matters here is that a token names exactly one Stripe
 * customer, cannot be edited to name a different one, and stops working when it expires, because
 * anyone holding the link can cancel that person's membership.
 */
import { signBillingToken, verifyBillingToken, billingPortalLink } from "@/lib/billing-portal-link";

const KEY = "test-billing-link-secret";

beforeEach(() => {
  process.env.BILLING_LINK_SECRET = KEY;
  process.env.NEXT_PUBLIC_SITE_URL = "https://itsmyszn.com";
  jest.useRealTimers();
});

describe("billing portal link tokens", () => {
  it("round-trips the customer id", () => {
    const token = signBillingToken("cus_ABC123")!;
    expect(verifyBillingToken(token)).toBe("cus_ABC123");
  });

  it("rejects a token whose payload was swapped for another customer", () => {
    const token = signBillingToken("cus_ABC123")!;
    const signature = token.slice(token.indexOf(".") + 1);
    const forgedPayload = Buffer.from(`cus_SOMEONE_ELSE:${Math.floor(Date.now() / 1000) + 999}`, "utf8").toString(
      "base64url"
    );
    expect(verifyBillingToken(`${forgedPayload}.${signature}`)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const token = signBillingToken("cus_ABC123")!;
    process.env.BILLING_LINK_SECRET = "rotated-secret";
    expect(verifyBillingToken(token)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = signBillingToken("cus_ABC123", -1)!;
    expect(verifyBillingToken(token)).toBeNull();
  });

  it("rejects junk", () => {
    expect(verifyBillingToken("")).toBeNull();
    expect(verifyBillingToken(null)).toBeNull();
    expect(verifyBillingToken("not-a-token")).toBeNull();
    expect(verifyBillingToken("a.b")).toBeNull();
  });

  it("builds a link on the public origin that the route can verify", () => {
    const link = billingPortalLink("cus_ABC123")!;
    expect(link.startsWith("https://itsmyszn.com/manage-billing?t=")).toBe(true);
    const token = decodeURIComponent(new URL(link).searchParams.get("t")!);
    expect(verifyBillingToken(token)).toBe("cus_ABC123");
  });

  it("returns null rather than a broken link when nothing can sign", () => {
    delete process.env.BILLING_LINK_SECRET;
    delete process.env.STRIPE_SECRET_KEY;
    expect(billingPortalLink("cus_ABC123")).toBeNull();
    expect(signBillingToken("cus_ABC123")).toBeNull();
  });
});
