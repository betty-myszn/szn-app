import { createClient } from "@/lib/supabase/client";

const STORED_CODE_KEY = "myszn_pending_referral";

// Called on the login page: if she arrived via someone's invite link (?ref=CODE), stash the
// code locally so it survives the magic-link email round trip and can be claimed once she's
// actually authenticated.
export function captureReferralCodeFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("ref");
  if (!code) return;
  try {
    localStorage.setItem(STORED_CODE_KEY, code);
  } catch {
    // ignore
  }
}

// Called once per session after login: if a referral code was stashed, claim it and clear it,
// a no-op for anyone who signed up without one or already claimed hers.
export async function claimStoredReferralIfAny(): Promise<void> {
  if (typeof window === "undefined") return;
  let code: string | null = null;
  try {
    code = localStorage.getItem(STORED_CODE_KEY);
  } catch {
    return;
  }
  if (!code) return;

  const supabase = createClient();
  await supabase.rpc("claim_referral", { p_code: code });
  try {
    localStorage.removeItem(STORED_CODE_KEY);
  } catch {
    // ignore
  }
}

export async function getMyReferralCode(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("referral_code").eq("id", user.id).maybeSingle();
  return data?.referral_code || null;
}

export async function getReferralCount(): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase.rpc("get_referral_count");
  return typeof data === "number" ? data : 0;
}
