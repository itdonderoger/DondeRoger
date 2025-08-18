import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = (req, res) => {
  const { email, password } = req.body;

  // Solo validar admin del .env
  if (
    email === config.emailAdmin.email &&
    password === config.emailAdmin.password
  ) {
    const token = jsonwebtoken.sign(
      { email, role: "admin" },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    // Guardar cookie (opcional)
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return res.json({ message: "Login exitoso", role: "admin", token });
  }

  return res.status(401).json({ message: "Credenciales incorrectas" });
};

export default loginController;
