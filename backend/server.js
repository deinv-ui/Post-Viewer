// server.js
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import postRoutes from "./routes/postRoutes.js";


const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/market", marketRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
import compression from "compression";
app.use(compression());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
