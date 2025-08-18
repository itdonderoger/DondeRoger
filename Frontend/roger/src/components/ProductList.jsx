// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import "../styles/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchBatches();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchBatches = async () => {
    const res = await fetch("http://localhost:4000/api/batches");
    const data = await res.json();
    const grouped = data.reduce((acc, batch) => {
      const id = batch.product._id;
      if (!acc[id]) acc[id] = [];
      acc[id].push(batch);
      return acc;
    }, {});
    setBatches(grouped);
  };

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      {products.map(p => (
        <div key={p._id} className="product-card">
          <div className="product-info">
            <h3>{p.name}</h3>
            <p><strong>Descripción:</strong> {p.description}</p>
            <p><strong>Código:</strong> {p.code}</p>
            <p><strong>Stock total:</strong> {p.totalStock}</p>
          </div>
          <div className="batch-info">
            <h4>Lotes / Precios</h4>
            {batches[p._id] ? (
              <ul>
                {batches[p._id].map(b => (
                  <li key={b._id}>
                    Precio: {b.price} | Stock: {b.remaining} | Código lote: {b.code}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay lotes registrados</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
