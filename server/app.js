const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// connecting to database
mongoose
  .connect(process.env.DB_KEY)
  .then(() => console.log(`\x1b[32m[mongodb] Connected to database\x1b[0m`))
  .catch((e) => console.error(e));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://app-62zq.onrender.com",
];
app.use(
  cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
