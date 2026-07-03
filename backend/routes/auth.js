import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, collegeId, password } = req.body;

    if (!name || !collegeId || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Validate TMU email
    if (!collegeId.endsWith("@tmu.ac.in")) {
      return res.status(400).json({ message: "College ID must be a TMU email" });
    }

    // Only College ID uniqueness check
    const exists = await User.findOne({ collegeId });
    if (exists) return res.status(400).json({ message: "College ID already registered" });

    const user = new User({ name, collegeId, email: collegeId, password }); // Use collegeId as email
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { name: user.name, collegeId: user.collegeId, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ message: "Missing credentials" });

    // Only allow TMU emails
    if (!identifier.endsWith("@tmu.ac.in")) {
      return res.status(400).json({ message: "Only TMU email can login" });
    }

    const user = await User.findOne({ collegeId: identifier });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { name: user.name, collegeId: user.collegeId, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});


// CHECK AUTH
router.get("/check", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    return res.status(401).json({ message: "Token expired" });
  }
});

// GET CURRENT USER
router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user,
  });
});


export default router;
