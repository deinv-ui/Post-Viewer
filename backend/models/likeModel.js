// models/likes.model.js
const db = require("../config/db");

// Add a like
exports.addLike = async (userId, postId) => {
  const query = `
    INSERT INTO likes (user_id, post_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE created_at = NOW();
  `;
  await db.query(query, [userId, postId]);
};

// Remove a like
exports.removeLike = async (userId, postId) => {
  const query = `
    DELETE FROM likes WHERE user_id = ? AND post_id = ?
  `;
  await db.query(query, [userId, postId]);
};

// Count likes for a post
exports.countLikes = async (postId) => {
  const query = `
    SELECT COUNT(*) AS totalLikes
    FROM likes
    WHERE post_id = ?
  `;
  const [rows] = await db.query(query, [postId]);
  return rows[0].totalLikes;
};

// Check if user already liked a post
exports.isLikedByUser = async (userId, postId) => {
  const query = `
    SELECT 1 FROM likes WHERE user_id = ? AND post_id = ? LIMIT 1
  `;
  const [rows] = await db.query(query, [userId, postId]);
  return rows.length > 0;
};
