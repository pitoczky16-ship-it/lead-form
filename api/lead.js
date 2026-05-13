export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: "API running" });
  }

  const data = req.body;

  console.log("Lead received:", data);

  return res.status(200).json({
    success: true,
    received: data
  });
}
