// src/components/CrearProducto.jsx
import React, { useState } from "react";
import "../styles/CrearProducto.css";

const CrearProducto = () => {
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
    setName("");
    setDescription("");
    setPrice("");
    setCode("");
    setStock("");

    // Recargar la página para actualizar la lista
    window.location.reload();
  };

  // Permite solo números enteros >=0
  const handleNumericChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // solo dígitos
      setter(value);
    }
  };

  // Permite decimales >= 0
  const handleDecimalChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) { // dígitos + punto opcional
      setter(value);
    }
  };

  return (
    <form className="crear-producto" onSubmit={handleSubmit}>
      <h3>Crear Producto</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="precio">Precio</label>
      <input
        id="precio"
        type="text"
        placeholder="Precio"
        value={price}
        onChange={handleDecimalChange(setPrice)} // ← cambio aquí
        required
      />

      <input
        type="text"
        placeholder="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <label htmlFor="stock">Stock inicial</label>
      <input
        id="stock"
        type="text"
        placeholder="Stock inicial"
        value={stock}
        onChange={handleNumericChange(setStock)}
      />

      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearProducto;
