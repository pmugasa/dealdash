const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const indexRouter = express.Router();

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

indexRouter.get("/", (req, res) => {
  res.send("hello world");
});
//routes
app.get("/api/3000", (req, res) => {
  res.send("hello world");
});
//load last
app.use(middleware.unknownEndpoint);
//app.use(middleware.errorHandler);

module.exports = app;
