// controllers/postController.js
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const userId = req.user.id; // assuming auth middleware sets req.user

    const newPost = await Post.create({
      title,
      content,
      image_url,
      user_id: userId,
    });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["created_at", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;

    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await post.update({ title, content, image_url });

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // toggle like
    if (post.likes_exists) {
      post.likes_exists = false;
      post.likes_count = Math.max(0, post.likes_count - 1);
    } else {
      post.likes_exists = true;
      post.likes_count += 1;
    }

    await post.save();

    res.json({ message: "Post like toggled", post });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error: error.message });
  }
};
