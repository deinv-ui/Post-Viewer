// routes/userRoutes.js
import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

// CRUD Routes
router.post("/", UserController.createUser);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
