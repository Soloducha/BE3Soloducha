import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB conectado (${config.nodeEnv})`);

    app.listen(config.port, () => {
      console.log(`✅ Servidor corriendo en puerto ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
