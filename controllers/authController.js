const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const bcrypt = require("bcrypt");

exports.sign_up_controller = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
        adminCode: req.body.adminCode,
      });
      const result = await user.save();
      res.redirect("/");
    });
  } catch (err) {
    return next(err);
  }
};

exports.login_get = (req, res) => {
  // If user is already logged in, redirect them to the homepage
  if (res.locals.currentUser) return res.redirect("/");
};
