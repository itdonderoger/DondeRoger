// src/components/RetirarStock.jsx
import React, { useEffect, useState } from "react";
import "../styles/RetirarStock.css";

const RetirarStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://donderoger.onrender.com/api/products");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Solo enteros positivos
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Seleccione un producto");
    if (!quantity || Number(quantity) <= 0) return alert("Ingrese cantidad válida");

    try {
      const res = await fetch("https://donderoger.onrender.com/api/batches/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct, quantity: Number(quantity) }),
      });

      const data = await res.json();
      if (!res.ok) return alert("Error: " + (data.error || "No se pudo retirar stock"));

      alert("Stock retirado correctamente");

      // Reset
      setQuantity("");
      setSelectedProduct("");

      // 🔹 Recargar página para actualizar ProductList
      window.location.reload();

    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form className="retirar-stock" onSubmit={handleSubmit}>
      <h3>Retirar Stock</h3>
      
      <label>Producto</label>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        required
      >
        <option value="">Seleccione producto</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <label>Cantidad a retirar</label>
      <input
        type="text"
        placeholder="Ingrese cantidad"
        value={quantity}
        onChange={handleQuantityChange}
        required
      />

      <button type="submit">Retirar</button>
    </form>
  );
};

export default RetirarStock;
