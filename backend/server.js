// server.js
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
import compression from "compression";

const app = express();

// Enable compression
app.use(compression());

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/market", marketRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 4000; // set to 4000 since frontend is 5174
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
