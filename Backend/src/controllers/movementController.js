import Movement from "../models/Movement.js";

// Obtener movimientos por producto
export const getMovementsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const movements = await Movement.find({ product: productId }).sort({ createdAt: 1 });
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
