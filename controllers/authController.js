const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
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
  res.json({ msg: "cors enabled, for login origins!" });
  // if (res.locals.currentUser) return res.redirect("/");
};
exports.login_controller = async function (req, res, next) {
  passport.use(
    new LocalStrategy(function verify(username, password, cb) {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        function (err, row) {
          if (err) {
            return cb(err);
          }
          if (!row) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }

          crypto.pbkdf2(
            password,
            row.salt,
            310000,
            32,
            "sha256",
            function (err, hashedPassword) {
              if (err) {
                return cb(err);
              }
              if (
                !crypto.timingSafeEqual(row.hashed_password, hashedPassword)
              ) {
                return cb(null, false, {
                  message: "Incorrect username or password.",
                });
              }
              return cb(null, row);
            }
          );
        }
      );
    })
  );
};
