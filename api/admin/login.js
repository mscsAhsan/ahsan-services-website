import { jsonBody } from "../_lib/db.js";
import { signToken, checkPassword } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });
  }
  const body = jsonBody(req);
  if (!checkPassword(body.password)) {
    return res.status(401).json({ error: "INVALID_PASSWORD" });
  }
  return res.status(200).json({ token: signToken() });
}
