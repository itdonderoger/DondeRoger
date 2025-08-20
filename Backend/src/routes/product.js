import express from "express";
import { createProduct, getProducts, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);    // Crear producto
router.get("/", getProducts);       // Listar productos
router.delete("/:id", deleteProduct); // Eliminar producto y sus lotes

export default router;
