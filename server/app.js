const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const authenticationRouter = require("./controllers/authentication");

const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(middleware.requestLogger);

//routes
app.use("/api/authentication", authenticationRouter);

//load last
app.use(middleware.unknownEndpoint);
//app.use(middleware.errorHandler);

module.exports = app;
