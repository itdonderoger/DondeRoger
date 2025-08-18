// src/controllers/logoutController.js
const logoutController = (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    expires: new Date(0), // expira inmediatamente
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logout exitoso" });
};

export default logoutController;
