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
    try {
      const res = await fetch("https://donderoger.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch("https://donderoger.onrender.com/api/batches");
      const data = await res.json();
      const grouped = data.reduce((acc, batch) => {
        const id = batch.product._id;
        if (!acc[id]) acc[id] = [];
        acc[id].push(batch);
        return acc;
      }, {});
      setBatches(grouped);
    } catch (err) {
      console.error("Error cargando lotes", err);
    }
  };

  const handleDeleteBatch = async (batchId, remaining) => {
  if (remaining > 0) {
    alert("No se puede eliminar un lote con stock disponible. Retíralo primero.");
    return;
  }

  if (!window.confirm("¿Seguro que deseas eliminar este lote?")) return;

  try {
    const res = await fetch(`https://donderoger.onrender.com/api/batches/${batchId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar lote");

    setBatches((prev) => {
      const updated = { ...prev };
      for (let key in updated) {
        updated[key] = updated[key].filter((b) => b._id !== batchId);
      }
      return updated;
    });

    fetchProducts();
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <div className="cards-container">
        {products.map((p) => (
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
                <div className="batch-cards">
                  {batches[p._id].map((b) => (
                    <div className="batch-cards">
                      {batches[p._id].map((b) => (
                        <div key={b._id} className="batch-card">
                          <p><strong>Precio:</strong> {b.price}</p>
                          <p><strong>Stock disponible:</strong> {b.remaining}</p>
                          <p><strong>Código de lote:</strong> {b.code}</p>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteBatch(b._id, b.remaining)}
                            title="Eliminar lote"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                  ))}
                </div>
              ) : (
                <p>No hay lotes registrados</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
