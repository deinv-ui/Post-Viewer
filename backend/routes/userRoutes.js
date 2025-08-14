import express from "express";
import * as UserController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", UserController.loginUser);
router.post("/", UserController.createUser);

router.get("/", protect, UserController.getUsers);
router.get("/:id", protect, UserController.getUser);
router.put("/:id", protect, UserController.updateUser);
router.delete("/:id", protect, UserController.deleteUser);

export default router;
