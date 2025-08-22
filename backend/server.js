// server.js
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
import compression from "compression";

const app = express();

// Enable compression
app.use(compression());

// Enable CORS for frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://blink-dx.vercel.app",
];

// Dynamic CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname)
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/finance", financeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 4000; // set to 4000 since frontend is 5174
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
