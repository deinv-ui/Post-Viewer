// controllers/postController.js
import * as PostModel from "../models/postModel.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const userId = req.user.id; // assuming auth middleware sets req.user

    const newPost = await PostModel.createPost(userId, title, content, image_url);

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.getPostById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;

    const post = await PostModel.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const updatedPost = await PostModel.updatePost(id, title, content, image_url);

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await PostModel.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await PostModel.deletePost(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

// Like / Unlike post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await PostModel.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // toggle like
    const like = !post.likes_exists;
    const updatedPost = await PostModel.toggleLike(id, like);

    res.json({ message: "Post like toggled", post: updatedPost });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post", error: error.message });
  }
};
