import { pool } from "../models/db.js";

export const searchCompanies = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query param q" });

  try {
    const result = await pool.query(
      "SELECT * FROM companies WHERE name ILIKE $1 OR ticker ILIKE $1",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
