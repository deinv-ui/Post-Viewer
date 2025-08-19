import express from "express";
import yahooFinance from "yahoo-finance2";
import axios from "axios";
const router = express.Router();

router.get("/top-gainers", async (req, res) => {
  try {
    const symbols = ["AAPL", "MSFT", "GOOG", "AMZN"];
    const data = await Promise.all(
      symbols.map((sym) => yahooFinance.quote(sym))
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/high-dividend", async (req, res) => {
  try {
    const symbols = ["T", "VZ", "JNJ", "PG"];
    const data = await Promise.all(
      symbols.map((sym) => yahooFinance.quote(sym))
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const stableSymbols = ["JNJ", "PG", "KO", "PEP", "WMT", "MCD", "VZ", "T", "CL", "MDLZ"];

router.get("/stable-stocks", async (req, res) => {
  try {
    // Fetch quotes for all stable symbols
    const data = await Promise.all(
      stableSymbols.map((sym) => yahooFinance.quote(sym))
    );

    // Optional: filter to ensure beta < 1
    const stableData = data.filter((stock) => stock.beta !== null && stock.beta < 1);

    res.json(stableData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stable stocks" });
  }
});

export default router;
