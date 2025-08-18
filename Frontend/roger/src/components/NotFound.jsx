import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>404 - No autorizado</h1>
      <p className="error-acceso">No tienes acceso a esta página.</p>
      <button onClick={() => navigate("/login")}>Ir al login</button>
    </div>
  );
};

export default Error404;
