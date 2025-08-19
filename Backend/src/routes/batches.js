import express from "express";
import {
  addStock,
  removeStock,
  getAllBatches,
  getProductBatches,
  deleteBatch,   // ⬅️ nuevo
} from "../controllers/batchController.js";

const router = express.Router();

router.post("/entry", addStock);
router.post("/exit", removeStock);
router.get("/", getAllBatches);
router.get("/:productId", getProductBatches);
router.delete("/:batchId", deleteBatch);  // ⬅️ nuevo

export default router;
