// Cryptographic password hashing and verification using Web Crypto API (SHA-256 + salt)
// Ensures passwords are never stored or compared in plain text.

export async function hashPassword(
  password: string,
  providedSalt?: string
): Promise<{ hash: string; salt: string }> {
  const salt =
    providedSalt ??
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36));

  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);

  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { hash: hashHex, salt };
  }

  // Fallback for environments where subtle is unavailable
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return { hash: `fallback-${Math.abs(hash).toString(16)}`, salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}
