import dotenv from "dotenv";

dotenv.config();

//INFO DEL .ENV
export const config={

    db: {
        URI: process.env.MONGO_URI //Base de datos en Mongo
    },

    server: {
        port: process.env.PORT //Puerto 
    },

    JWT: {
        secret: process.env.JWT_SECRET,         //JWT para el inicio de sesión
        expiresIn: process.env.JWT_EXPIRES
    },

    emailAdmin: {
        email: process.env.ADMIN_EMAIL,         //Correo y contraseña del administrador
        password: process.env.ADMIN_PASSWORD
    },
    
}