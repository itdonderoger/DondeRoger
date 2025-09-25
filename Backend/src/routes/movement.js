import express from "express";
import { getMovementsByProduct } from "../controllers/movementController.js";

const router = express.Router();

router.get("/:productId", getMovementsByProduct);

export default router;
