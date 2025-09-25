import React, { useState } from "react";
import "../styles/RetirarStock.css";

const RetirarStock = ({ products, onRefresh }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return alert("Complete todos los campos");

    const res = await fetch("https://donderoger.onrender.com/api/batches/exit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedProduct, quantity: Number(quantity) })
    });

    const data = await res.json();
    if (!res.ok) return alert("Error: " + (data.error || "No se pudo retirar stock"));

    alert("Stock retirado correctamente");
    setSelectedProduct(""); setQuantity("");
    if (onRefresh) onRefresh();
    window.location.reload();
  };

  return (
    <form className="retirar-stock" onSubmit={handleSubmit}>
      <h3>Retirar Stock</h3>
      <label>Producto</label>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
        <option value="">Seleccione producto</option>
        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      <label>Cantidad a retirar</label>
      <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} required />
      <button type="submit">Retirar</button>
    </form>
  );
};

export default RetirarStock;
