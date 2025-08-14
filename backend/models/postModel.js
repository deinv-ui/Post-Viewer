// models/postModel.js
import { pool } from "../models/db.js";

// Create Post
export const createPost = async (user_id, title, content, image_url) => {
  const query = `
    INSERT INTO posts (user_id, title, content, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [user_id, title, content, image_url];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get all posts
export const getAllPosts = async () => {
  const { rows } = await pool.query(`
    SELECT p.*, u.username, u.avatar_url 
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC;
  `);
  return rows;
};

// Get single post by ID
export const getPostById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, u.username, u.avatar_url 
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0];
};

// Update post
export const updatePost = async (id, title, content, image_url) => {
  const query = `
    UPDATE posts
    SET title = $1, content = $2, image_url = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [title, content, image_url, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Delete post
export const deletePost = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING id;",
    [id]
  );
  return rows[0];
};

// Like / Unlike post (toggle)
export const toggleLike = async (id, like = true) => {
  const query = `
    UPDATE posts
    SET likes_count = likes_count + $1, likes_exists = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [like ? 1 : -1, like, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
