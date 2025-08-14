// controllers/likes.controller.js
const LikesModel = require("../models/likes.model");

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.body.userId; // assume userId comes from auth middleware

  try {
    await LikesModel.addLike(userId, postId);
    const totalLikes = await LikesModel.countLikes(postId);
    res.json({ success: true, message: "Post liked", totalLikes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.body.userId;

  try {
    await LikesModel.removeLike(userId, postId);
    const totalLikes = await LikesModel.countLikes(postId);
    res.json({ success: true, message: "Post unliked", totalLikes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const totalLikes = await LikesModel.countLikes(postId);
    res.json({ success: true, totalLikes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
