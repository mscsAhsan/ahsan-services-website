import crypto from "node:crypto";

function hmacKey() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function b64urlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function b64urlDecode(input) {
  return Buffer.from(input, "base64url");
}

function hashEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function signToken() {
  const payload = { exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  const payloadPart = b64urlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", hmacKey())
    .update(payloadPart)
    .digest("base64url");
  return `${payloadPart}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadPart, signature] = parts;
  const expected = crypto
    .createHmac("sha256", hmacKey())
    .update(payloadPart)
    .digest("base64url");
  if (!hashEqual(signature, expected)) return false;
  try {
    const payload = JSON.parse(b64urlDecode(payloadPart).toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof password !== "string") return false;
  return hashEqual(password, expected);
}

export function bearerToken(req) {
  const header = req.headers && req.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
