import express from "express";
import { addStock, removeStock, getAllBatches, getProductBatches } from "../controllers/batchController.js";

const router = express.Router();

router.post("/entry", addStock);          // Agregar stock
router.post("/exit", removeStock);        // Retirar stock
router.get("/", getAllBatches);           // Todos los lotes
router.get("/:productId", getProductBatches); // Lotes de un producto

export default router;
