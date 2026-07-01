const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

function authenticateToken(req, res, next) {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid/Expired token" });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
