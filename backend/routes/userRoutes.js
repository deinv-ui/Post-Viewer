import express from "express";
import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", UserController.loginUser);
router.post("/register", UserController.createUser);

router.get("/", authMiddleware, UserController.getUsers);
router.get("/:id", authMiddleware, UserController.getUser);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
