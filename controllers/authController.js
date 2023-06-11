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
  if (res.locals.currentUser) return res.redirect("/");
};
exports.login_controller = async function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Incorrect Username or Password",
        user,
      });
    }
    jwt.sign(
      { _id: user._id, username: user.username },
      process.env.SECRET,
      { expiresIn: "10m" },
      (err, token) => {
        if (err) return res.status(400).json(err);
        res.json({
          token: token,
          user: { _id: user._id, username: user.username },
        });
      }
    );
  })(req, res);
};
