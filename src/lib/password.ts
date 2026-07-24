// Shared password rule used everywhere a member sets a password (account creation, reset,
// set-password). Length-based on purpose: a long passphrase or a password-manager-generated string
// is exactly what we want to encourage, so we don't impose character-class composition rules that
// would reject "correct horse battery staple" or a manager's output. No maximum length, and the
// inputs never block paste or autofill.
export const MIN_PASSWORD_LENGTH = 10;
export const PASSWORD_HINT = `Use at least ${MIN_PASSWORD_LENGTH} characters. A short phrase works great.`;

export function validatePassword(password: string): { ok: boolean; message: string } {
  if (password.length >= MIN_PASSWORD_LENGTH) return { ok: true, message: "" };
  return { ok: false, message: PASSWORD_HINT };
}
