import React, { useState, useEffect } from "react";
import "../styles/AgregarStock.css";

const AgregarStock = ({ products, batches, onRefresh }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (selectedBatch) {
      const batch = batches[selectedProduct]?.find(b => b._id === selectedBatch);
      if (batch) setPrice(batch.price);
    }
  }, [selectedBatch, selectedProduct, batches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !price) return alert("Complete todos los campos");

    const body = {
      productId: selectedProduct,
      quantity: Number(quantity),
      price: Number(price),
      batchId: selectedBatch || undefined,
      code: selectedBatch ? undefined : `L-${Date.now()}`
    };

    const res = await fetch("https://donderoger.onrender.com/api/batches/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) return alert("Error al agregar stock");
    await res.json();
    alert(selectedBatch ? "Lote actualizado" : "Stock agregado");

    setSelectedProduct(""); setSelectedBatch(""); setQuantity(""); setPrice("");
    if (onRefresh) onRefresh();
  };

  return (
    <form className="agregar-stock" onSubmit={handleSubmit}>
      <h3>Agregar Stock</h3>
      <label>Producto</label>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
        <option value="">Seleccione producto</option>
        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>

      {selectedProduct && batches[selectedProduct]?.length > 0 && (
        <>
          <label>Lote existente</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            <option value="">Nuevo lote / Precio distinto</option>
            {batches[selectedProduct].map(b => (
              <option key={b._id} value={b._id}>
                Código: {b.code} | Precio: {b.price}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Precio</label>
      <input type="text" value={price} onChange={e => setPrice(e.target.value)} required />
      <label>{selectedBatch ? "Cantidad a agregar" : "Cantidad"}</label>
      <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} required />
      <button type="submit">{selectedBatch ? "Actualizar Lote" : "Agregar"}</button>
    </form>
  );
};

export default AgregarStock;
