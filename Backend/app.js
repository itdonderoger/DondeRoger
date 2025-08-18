// Dependencias
import express from "express";
import cors from "cors";


// Rutas
import productsRoutes from "./src/routes/product.js";
import batchesRoutes from "./src/routes/batches.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://donde-roger.vercel.app"],  // permite ambos puertos
    credentials: true,
  })
);
app.use(express.json());

// Endpoints
app.use("/api/products", productsRoutes);   // Productos
app.use("/api/batches", batchesRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);


export default app;
