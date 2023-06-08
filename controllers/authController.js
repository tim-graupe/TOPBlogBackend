const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");

exports.sign_up_controller = async (req, res, next) => [
  body("username", "Username required!")
    .trim()
    .isLength({ min: 2, max: 24 })
    .escape(),
  body("password").trim().isLength({ min: 6 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    let desiredName = await User.findOne({ username: req.body.username });
    if (desiredName) {
      alert("User Already Exists");
    }
    if (!errors.isEmpty() && !desiredName) {
      return;
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      admin: req.body.admin,
      member: req.body.member ? true : false,
    });
    bcrypt.hash(req.body.password, 10, (err, hashedPwd) => {
      if (err) return next(err);
      user.password = hashedPwd;
      user.save((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  },
];

exports.login_get = (req, res) => {
  // If user is already logged in, redirect them to the homepage
  if (res.locals.currentUser) return res.redirect("/");
};

exports.login_controller = async (req, res, next) => {};
