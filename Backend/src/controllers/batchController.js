import Product from "../models/Product.js";
import Batch from "../models/Batch.js";
import Movement from "../models/Movement.js";

// Agregar stock (o actualizar lote existente)
export const addStock = async (req, res) => {
  try {
    const { productId, quantity, price, code, batchId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    let batch;

    if (batchId) {
      // 🔹 Actualizar lote existente
      batch = await Batch.findById(batchId);
      if (!batch) return res.status(404).json({ error: "Lote no encontrado" });

      batch.remaining += Number(quantity);
      batch.price = Number(price.toFixed(2)); // aseguramos decimales
      await batch.save();
    } else {
      // 🔹 Crear nuevo lote
      batch = await Batch.create({
        product: productId,
        quantity: Number(quantity),
        remaining: Number(quantity),
        price: Number(price.toFixed(2)),
        code,
      });
    }

    // 🔹 Actualizar stock total del producto
    product.totalStock += Number(quantity);
    await product.save();

    // 🔹 Registrar movimiento
    await Movement.create({
      product: productId,
      type: "entrada",
      quantity: Number(quantity),
      price: Number(price.toFixed(2)),
      code: batch.code,
    });

    res.json({ product, batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retirar stock FIFO
export const removeStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    if (product.totalStock < quantity) return res.status(400).json({ error: "Stock insuficiente" });

    let qtyToRemove = Number(quantity);
    const batches = await Batch.find({ product: productId, remaining: { $gt: 0 } }).sort({ date: 1 });
    const removed = [];

    for (let batch of batches) {
      if (qtyToRemove <= 0) break;

      const deduct = Math.min(batch.remaining, qtyToRemove);
      batch.remaining -= deduct;
      await batch.save();

      await Movement.create({
        product: productId,
        type: "salida",
        quantity: deduct,
        price: batch.price,
        code: batch.code,
      });

      removed.push({
        batchId: batch._id,
        quantity: deduct,
        price: batch.price,
        code: batch.code,
      });

      qtyToRemove -= deduct;
    }

    product.totalStock -= Number(quantity);
    await product.save();

    res.json({ product, removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos los lotes
export const getAllBatches = async (req, res) => {
  const batches = await Batch.find().populate("product");
  res.json(batches);
};

// Lotes de un producto
export const getProductBatches = async (req, res) => {
  const { productId } = req.params;
  const batches = await Batch.find({ product: productId });
  res.json(batches);
};
