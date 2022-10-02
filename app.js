const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

module.exports = app;
