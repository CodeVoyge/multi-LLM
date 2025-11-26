// JWT implementation with HMAC-SHA256 signature
import crypto from "crypto"

interface TokenPayload {
  userId: string
  email: string
  role: "user" | "admin"
}

const SECRET = process.env.JWT_SECRET || "demo-secret-key-change-in-production"

export function createToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")

  const signature = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url")

  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, body, signature] = parts

    // Verify signature
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url")

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(body, "base64url").toString())
    return payload
  } catch {
    return null
  }
}
