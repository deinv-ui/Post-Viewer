// models/userModel.js
import { pool } from "../models/db.js";

export const createUser = async (username, email, passwordHash) => {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [username, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllUsers = async () => {
  const { rows } = await pool.query("SELECT id, username, email, created_at FROM users;");
  return rows;
};

export const getUserById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1;",
    [id]
  );
  return rows[0];
};

export const updateUser = async (id, username, email) => {
  const query = `
    UPDATE users
    SET username = $1, email = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING id, username, email, updated_at;
  `;
  const values = [username, email, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteUser = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id;",
    [id]
  );
  return rows[0];
};
