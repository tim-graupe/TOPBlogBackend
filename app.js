const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const User = require("./models/newUserModel");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const router = require("./routes/api");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
// app.use(passport.authenticate("session"));
//cors
const corsOptions = {
  origin: [
    "http://localhost:3000, https://topblogbackend-production.up.railway.app/entries, https://topblogbackend-production.up.railway.app/, https://topblogbackend-production.up.railway.app/log_in",
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

//passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

app.use(
  session({
    secret: "dogs",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((error) => {
      return done(error, false);
    });
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    console.log("deserialize");
    console.log(user);
    console.log(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(strategy);
app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// app.options("*", cors(cors(corsOptions)));
app.use("/", router);
app.use("/entries", router);
app.use("/new_entry", router);
app.use("/sign_up", router);
app.use("/log_in", router);
app.use("/log_out", router);
app.post("/sign_up", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});
app.delete("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});

app.put("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});

// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   console.log(req.user);
//   console.log(res.locals.currentUser);
//   next();
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;
