import express from "express";
import { fetchAndCachePrices, fetchAndCacheDividends, getCachedSeries } from "../services/marketServices.js";

const router = express.Router();

// GET cached series (prices + dividends)
router.get("/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const data = await getCachedSeries(ticker.toUpperCase());
  if (!data.company) return res.status(404).json({ error: "Ticker not found in cache" });
  res.json(data);
});

// POST refresh from provider then return cached data
router.post("/:ticker/refresh", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  await fetchAndCachePrices(ticker, "5y", "1d");
  await fetchAndCacheDividends(ticker, "10y");
  const data = await getCachedSeries(ticker);
  res.json({ refreshed: true, ...data });
});

export default router;
