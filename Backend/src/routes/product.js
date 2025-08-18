import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);    // Crear producto
router.get("/", getProducts);       // Listar productos

export default router;
