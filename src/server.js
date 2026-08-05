import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";
import { logger } from "./utils/logger.js";

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info(`✅ MongoDB conectado (${config.nodeEnv})`);

    app.listen(config.port, () => {
      logger.info(`✅ Servidor corriendo en puerto ${config.port}`);
    });
  } catch (error) {
    logger.fatal(error.message, { stack: error.stack });
    process.exit(1);
  }
}

startServer();
