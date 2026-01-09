import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Users only" });
  }
  next();
};
