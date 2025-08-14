import * as UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const createUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save user
    const user = await UserModel.createUser(username, email, passwordHash);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.getUserByEmail(email);

    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    // Generate JWT token (or any token)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};
