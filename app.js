var createError = require("http-errors");
var express = require("express");
var path = require("path");
require("dotenv").config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var router = require("./routes/api");
const cors = require("cors");
var app = express();

//cors
const corsOptions = {
  origin: [
    "http://localhost:3000, https://topblogbackend-production.up.railway.app/entries, https://topblogbackend-production.up.railway.app/",
  ],
  optionSuccessStatus: 200,
};
//mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.options("*", cors(cors(corsOptions)));
app.use("/", router);
app.use("/entries", router);
app.use("/new_entry", router);

app.delete("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});

app.put("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});
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
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;
