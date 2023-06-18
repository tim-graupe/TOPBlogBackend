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
const LocalStrategy = require("passport-local").Strategy;
const router = require("./routes/api");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(express.bodyParser());
//cors
const corsOptions = {
  origin: [
    "http://localhost:3000, https://topblogbackend-production.up.railway.app/entries, https://topblogbackend-production.up.railway.app/, https://topblogbackend-production.up.railway.app/log-in",
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
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// app.options("*", cors(cors(corsOptions)));
app.use("/", router);
app.use("/entries", router);
app.use("/new_entry", router);
app.use("/sign_up", router);
app.use("/log-in", router);

//passport

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      // req.body.password was previously req.body.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });

      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(function (req, res, next) {
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  console.log(res.locals.currentUser);
  console.log(req.session);
  next();
});

app.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/sign_up", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});
app.delete("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});

app.put("/entries/:id", cors(), function (req, res, next) {
  res.json({ msg: "cors enabled, for all origins!" });
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  console.log(req.user);
  console.log(res.locals.currentUser);
  next();
});

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
