import yahooFinance from "yahoo-finance2";
import { pool } from "../models/db.js";

// ensure company exists, return id
export async function upsertCompany(ticker, meta = {}) {
  const { rows } = await pool.query(
    `INSERT INTO companies (ticker, name, sector)
     VALUES ($1, $2, $3)
     ON CONFLICT (ticker) DO UPDATE SET name = COALESCE(EXCLUDED.name, companies.name),
                                       sector = COALESCE(EXCLUDED.sector, companies.sector),
                                       updated_at = NOW()
     RETURNING id`,
    [ticker, meta.name || null, meta.sector || null]
  );
  return rows[0].id;
}

export async function fetchAndCachePrices(ticker, range = "5y", interval = "1d") {
  const chart = await yahooFinance.chart(ticker, { range, interval }); // OHLCV
  const cId = await upsertCompany(ticker);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of chart.quotes) {
      await client.query(
        `INSERT INTO price_history (company_id,date,open,high,low,close,volume)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (company_id,date) DO UPDATE SET
           open=EXCLUDED.open, high=EXCLUDED.high, low=EXCLUDED.low,
           close=EXCLUDED.close, volume=EXCLUDED.volume`,
        [cId, p.date.toISOString().slice(0,10), p.open, p.high, p.low, p.close, p.volume]
      );
    }
    await client.query("COMMIT");
    return { companyId: cId, points: chart.quotes.length };
  } finally {
    client.release();
  }
}

export async function fetchAndCacheDividends(ticker, range = "10y") {
  // dividends appear as events in chart
  const chart = await yahooFinance.chart(ticker, { range, interval: "1mo", events: "dividends" });
  const cId = await upsertCompany(ticker);
  const events = chart.events?.dividends || {};
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const k of Object.keys(events)) {
      const d = events[k];
      await client.query(
        `INSERT INTO dividends (company_id, ex_date, cash_amount, pay_date)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (company_id, ex_date) DO UPDATE SET
           cash_amount = EXCLUDED.cash_amount, pay_date = EXCLUDED.pay_date`,
        [cId, new Date(d.date).toISOString().slice(0,10), d.amount ?? null, d.payDate ? new Date(d.payDate).toISOString().slice(0,10) : null]
      );
    }
    await client.query("COMMIT");
    return { companyId: cId, count: Object.keys(events).length };
  } finally {
    client.release();
  }
}

export async function getCachedSeries(ticker) {
  const { rows: c } = await pool.query("SELECT id,name,sector FROM companies WHERE ticker=$1", [ticker]);
  if (!c.length) return { company: null, prices: [], dividends: [] };
  const company = c[0];
  const { rows: prices } = await pool.query(
    "SELECT date, open, high, low, close, volume FROM price_history WHERE company_id=$1 ORDER BY date",
    [company.id]
  );
  const { rows: dividends } = await pool.query(
    "SELECT ex_date, cash_amount, pay_date FROM dividends WHERE company_id=$1 ORDER BY ex_date",
    [company.id]
  );
  return { company: { id: company.id, ticker, name: company.name, sector: company.sector }, prices, dividends };
}
