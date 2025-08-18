// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CrearProducto from "../components/CrearProducto";
import AgregarStock from "../components/AgregarStock";
import RetirarStock from "../components/RetirarStock";
import ProductList from "../components/ProductList";
import Error404 from "../components/NotFound";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(true);

  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState({});

  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn");
    if (!isLogged) setAuthorized(false);
    else fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

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

  // Llama a ambos
  const fetchAll = () => {
    fetchProducts();
    fetchBatches();
  };

  if (!authorized) return <Error404 />;

  return (
    <div className="dashboard">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1>Sistema de Productos</h1>
      <div className="forms">
        <CrearProducto onRefresh={fetchAll} />
        <AgregarStock products={products} onRefresh={fetchAll} batches={batches} />
        <RetirarStock products={products} onRefresh={fetchAll} />
      </div>
      <ProductList products={products} batches={batches} />
    </div>
  );
};

export default Dashboard;
