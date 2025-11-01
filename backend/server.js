import app from "./app.js";
import config from "./app/config/index.js";
import mongoose from "mongoose";

const PORT = config.app.port;

async function startServer() {
  try {
    mongoose.connect(config.db.uri);
    console.log("Connected to the database!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Cannot connect to the database! ${error}`);
    process.exit();
  }
}

startServer();
