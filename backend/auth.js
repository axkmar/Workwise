const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;           // "Bearer <token>"
  if (!header) return res.status(401).json({ error: "Not logged in" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET); // { id: ... }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = auth

