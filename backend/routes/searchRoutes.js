import express from "express";
import { searchCompanies } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchCompanies);

export default router;
