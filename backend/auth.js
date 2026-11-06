const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY

function auth(req, res, next) {
  const header = req.headers.authorization;           // "Bearer <token>"
  if (!header) return res.status(401).json({ error: "Not logged in" });
  try {
    req.user = jwt.verify(header.split(" ")[1], JWT_KEY); // { id: ... }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = auth

