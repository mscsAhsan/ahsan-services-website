// Vercel serverless version of /api/contact. Messages show up in Vercel function logs.
// To get them by email, forward `entry` to Resend / Formspree / EmailJS here.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, service, message } = req.body || {};
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return res.status(400).json({ error: "Please fill in your name, a valid email and a message." });
  }
  console.log("[contact]", { name, email, service, message });
  res.status(200).json({ ok: true });
}
