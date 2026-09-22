const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Trust reverse proxies (Render)
app.set("trust proxy", 1);

// Enable CORS
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Root route for health check
app.get("/", (req, res) => {
  res.json({ message: "Login API is running." });
});

// Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      secret,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful.",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Profile Endpoint
app.get("/api/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret);
    res.json({
      message: "Protected data.",
      user: { name: decoded.name, email: decoded.email },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

// Port Binding (Runs immediately so Render doesn't exit early)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database Connection
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch((error) =>
      console.error("MongoDB connection failed:", error.message)
    );
} else {
  console.error("MONGODB_URI environment variable is missing.");
}