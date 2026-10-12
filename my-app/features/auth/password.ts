export type PasswordStrength = {
  /** 0 = nothing typed, 1 to 4 = weak to strong. */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
};

/**
 * A gentle hint for the register and reset screens, not a security rule.
 * It rewards length first, then variety. Better Auth enforces the real limits.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return { score: 0, label: "" };
  if (password.length < 8) return { score: 1, label: "Too short" };

  const points = [
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  // 8+ characters earns one point; each extra quality adds one, capped at 4.
  const score = Math.min(4, 1 + points) as 1 | 2 | 3 | 4;
  const label = ["", "Weak", "Okay", "Good", "Strong"][score];
  return { score, label };
}
