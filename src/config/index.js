import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Falta definir la variable de entorno: ${varName}`);
  }
});

const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;
