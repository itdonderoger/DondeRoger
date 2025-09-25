import React, { useState } from "react";
import "../styles/CrearProducto.css";

const CrearProducto = ({ onRefresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://donderoger.onrender.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        code,
        totalStock: Number(stock),
      }),
    });
    const data = await res.json();
    alert("Producto creado: " + data.name);

    // Limpiar campos
    setName(""); setDescription(""); setPrice(""); setCode(""); setStock("");

    if (onRefresh) onRefresh();
  };

  const handleNumericChange = (setter) => (e) => {
    if (/^\d*$/.test(e.target.value)) setter(e.target.value);
  };
  const handleDecimalChange = (setter) => (e) => {
    if (/^\d*\.?\d*$/.test(e.target.value)) setter(e.target.value);
  };

  return (
    <form className="crear-producto" onSubmit={handleSubmit}>
      <h3>Crear Producto</h3>
      <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
      <label>Precio</label>
      <input type="text" value={price} onChange={handleDecimalChange(setPrice)} required />
      <input type="text" placeholder="Código" value={code} onChange={e => setCode(e.target.value)} required />
      <label>Stock inicial</label>
      <input type="text" value={stock} onChange={handleNumericChange(setStock)} />
      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearProducto;
