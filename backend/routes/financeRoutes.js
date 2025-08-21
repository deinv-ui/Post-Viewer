// routes/financeRoutes.js
import express from "express";
import yahooFinance from "yahoo-finance2";
import stocks from "../data/stocks.json" with { type: "json" };

const router = express.Router();

// Convert Bursa code → Yahoo format
function toYahooSymbol(code) {
  return `${code}.KL`;
}

// Fetch multiple quotes safely
async function fetchQuotes(codes) {
  return Promise.all(
    codes.map(async (code) => {
      try {
        const data = await yahooFinance.quote(toYahooSymbol(code));
        return data || null;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch ${code}:`, err.message);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean)); // remove nulls
}

// Merge Yahoo data with our metadata
function mergeWithMeta(d) {
  if (!d?.symbol) return null; // safeguard
  const cleanCode = d.symbol.replace(".KL", "");
  const meta = stocks.find((s) => s.code === cleanCode);
  return { ...meta, ...d };
}

// Get codes by category
function getCategoryCodes(category) {
  return stocks
    .filter((s) => s.categories?.includes(category))
    .map((s) => s.code);
}

// ------------------- Routes ------------------- //

// Top Gainers
router.get("/top-gainers", async (req, res) => {
  try {
    const codes = getCategoryCodes("topGainers");
    const data = await fetchQuotes(codes);
    res.json(data.map(mergeWithMeta).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// High Dividend
router.get("/high-dividend", async (req, res) => {
  try {
    const codes = getCategoryCodes("highDividend");
    const data = await fetchQuotes(codes);
    res.json(data.map(mergeWithMeta).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stable Stocks
router.get("/stable-stocks", async (req, res) => {
  try {
    const codes = getCategoryCodes("stable");
    const data = await fetchQuotes(codes);
    const stableData = data
      .filter((d) => d?.beta !== null && d.beta < 1)
      .map(mergeWithMeta)
      .filter(Boolean);
    res.json(stableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single stock
router.get("/stock/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const stockMeta = stocks.find((s) => s.code === code);
    if (!stockMeta) return res.status(404).json({ error: "Stock not found" });

    const data = await yahooFinance.quote(toYahooSymbol(code));
    if (!data) return res.status(404).json({ error: "Yahoo Finance data not found" });

    res.json({ ...stockMeta, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search
router.get("/search", (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";
    if (!query) return res.status(400).json({ error: "Missing search query" });

    const results = stocks.filter(
      (s) =>
        s.code.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query)
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
