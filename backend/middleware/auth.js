import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "Invalid user" });
    req.user = user;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
