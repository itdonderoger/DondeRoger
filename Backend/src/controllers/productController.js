import Product from "../models/Product.js";
import Batch from "../models/Batch.js";
import Movement from "../models/Movement.js";

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, code, totalStock } = req.body;
    const product = new Product({ name, description, price, code, totalStock });
    await product.save();

    if (totalStock > 0) {
      await Batch.create({ product: product._id, quantity: totalStock, remaining: totalStock, price, code });
      await Movement.create({ product: product._id, type: "entrada", quantity: totalStock, price, code });
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }


  
};


// Eliminar producto y sus lotes
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existe el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Eliminar lotes asociados
    await Batch.deleteMany({ product: id });

    // Eliminar movimientos relacionados (opcional)
    await Movement.deleteMany({ product: id });

    // Eliminar producto
    await Product.findByIdAndDelete(id);

    res.json({ message: "Producto y sus lotes eliminados correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

