import React, { useEffect, useState } from "react";
import "../styles/Kardex.css";

const Kardex = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    if (selectedProduct) fetchMovements();
    else setMovements([]);
  }, [selectedProduct]);

  const fetchMovements = async () => {
    try {
      const res = await fetch(`https://donderoger.onrender.com/api/movements/${selectedProduct}`);
      if (!res.ok) throw new Error("No se pudieron cargar los movimientos");
      const data = await res.json();
      setMovements(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const calculateExistencias = (data) => {
    let total = 0;
    return data.map(mov => {
      if (mov.type === "entrada") total += mov.quantity;
      else total -= mov.quantity;
      return { ...mov, existencias: total };
    });
  };

  const formattedData = calculateExistencias(movements);

  return (
    <div className="kardex-container">
      <h2>Kardex</h2>

      <label>Producto</label>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
        <option value="">-- Selecciona --</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {selectedProduct && (
        <table className="kardex-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cantidad Entrada</th>
              <th>Precio Unitario</th>
              <th>Total Entrada</th>
              <th>Cantidad Salida</th>
              <th>Precio Unitario</th>
              <th>Total Salida</th>
              <th>Existencias</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.length > 0 ? (
              formattedData.map(mov => (
                <tr key={mov._id}>
                  <td>{new Date(mov.date).toLocaleDateString()}</td>
                  {mov.type === "entrada" ? (
                    <>
                      <td>{mov.quantity}</td>
                      <td>{mov.price.toFixed(2)}</td>
                      <td>{(mov.quantity * mov.price).toFixed(2)}</td>
                      <td></td><td></td><td></td>
                    </>
                  ) : (
                    <>
                      <td></td><td></td><td></td>
                      <td>{mov.quantity}</td>
                      <td>{mov.price.toFixed(2)}</td>
                      <td>{(mov.quantity * mov.price).toFixed(2)}</td>
                    </>
                  )}
                  <td>{mov.existencias}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No hay movimientos para este producto
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Kardex;
