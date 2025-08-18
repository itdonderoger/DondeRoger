// src/components/AgregarStock.jsx
import React, { useEffect, useState } from "react";
import "../styles/AgregarStock.css";

const AgregarStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    if (!res.ok) return alert("Error al cargar productos");
    const data = await res.json();
    setProducts(data);
  };

  const fetchBatches = async (productId) => {
    if (!productId) return setBatches([]);
    const res = await fetch(`http://localhost:4000/api/batches/${productId}`);
    if (!res.ok) return alert("Error al cargar lotes");
    const data = await res.json();
    setBatches(data);
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    setSelectedBatch("");
    setPrice("");
    setQuantity("");
    fetchBatches(productId);
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    const batch = batches.find(b => b._id === batchId);
    setPrice(batch ? batch.price : "");
    setQuantity("");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Seleccione un producto");
    if (!quantity || Number(quantity) <= 0) return alert("Ingrese cantidad válida");
    if (!price || Number(price) <= 0) return alert("Ingrese precio válido");

    const body = {
      productId: selectedProduct,
      quantity: Number(quantity),
      price: Number(price),
      batchId: selectedBatch || undefined,
      code: selectedBatch ? undefined : `L-${Date.now()}`,
    };

    const res = await fetch("http://localhost:4000/api/batches/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) return alert("Error al agregar stock");
    await res.json();
    alert(selectedBatch ? "Lote actualizado correctamente" : "Stock agregado correctamente");

    // Reset
    setQuantity("");
    setPrice("");
    setSelectedBatch("");

    // Recargar página para actualizar la lista
    window.location.reload();
  };

  return (
    <form className="agregar-stock" onSubmit={handleSubmit}>
      <h3>Agregar Stock</h3>

      <label>Producto</label>
      <select value={selectedProduct} onChange={handleProductChange} required>
        <option value="">Seleccione producto</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {batches.length > 0 && (
        <>
          <label>Lote existente</label>
          <select value={selectedBatch} onChange={handleBatchChange}>
            <option value="">Nuevo lote / Precio distinto</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>
                Código: {b.code} | Precio: {b.price}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Precio</label>
      <input
        type="text"
        placeholder="Precio"
        value={price}
        onChange={handlePriceChange}
        required
      />

      <label>{selectedBatch ? "Cantidad a agregar" : "Cantidad"}</label>
      <input
        type="text"
        placeholder={selectedBatch ? "Cantidad a agregar" : "Cantidad"}
        value={quantity}
        onChange={handleQuantityChange}
        required
      />

      <button type="submit">{selectedBatch ? "Actualizar Lote" : "Agregar"}</button>
    </form>
  );
};

export default AgregarStock;
