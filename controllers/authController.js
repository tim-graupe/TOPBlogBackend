const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

exports.sign_up_controller = [
  body("username", "Username required!")
    .trim()
    .isLength({ min: 2, max: 24 })
    .escape(),
  body("password").trim().isLength({ min: 6 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    let desiredName = await User.findOne({ username: req.body.username });
    if (desiredName) {
      console.log("User Already Exists");
      return;
    }
    if (!errors.isEmpty() && !desiredName) {
      return;
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      adminCode: req.body.adminCode,
    });
    bcrypt.hash(req.body.password, 10, (err, hashedPwd) => {
      try {
        user.password = hashedPwd;
        user.save();
      } catch (err) {
        console.log("error found, " + err);
      }
      // if (err) return next(err);
      // user.password = hashedPwd;
      // user.save((err) => {
      //   if (err) return next(err);
      //   res.redirect("/");
      // });
    });
    // user.save((err) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.redirect("/");
    // });
  },
];

exports.login_get = (req, res) => {
  if (res.locals.currentUser) return res.redirect("/", { user: req.user });
};
exports.login_post = (req, res, next) => {
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

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Login successful" });
    });
  })(req, res, next);
};
