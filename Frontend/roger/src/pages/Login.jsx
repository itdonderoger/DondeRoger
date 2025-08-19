import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // mostrar spinner y alerta

    try {
      const res = await fetch("https://donderoger.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // importante para que guarde la cookie
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loggedIn", "true"); // <-- flag
        navigate("/dashboard"); // redirige al dashboard
      } else {
        alert(data.message || "Error en login ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Error de servidor ❌");
    } finally {
      setLoading(false); // ocultar spinner
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo contraseña con ojito */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* Mensaje de carga con spinner */}
        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            Espera a que cargue el servidor...
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
