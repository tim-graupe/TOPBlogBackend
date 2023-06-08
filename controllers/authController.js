const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const bcrypt = require("bcrypt");

exports.sign_up_controller = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    let desiredName = await User.findOne({ username: req.body.username });
    if (desiredName) {
      return res.render("signup", { userError: "User Already Exists" });
    }
    if (!errors.isEmpty() && !desiredName) {
      res.render("signup", {
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        member: req.body.member ? true : false,
      });
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
    // user.save((err) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.redirect("/");
    // });
  } catch (err) {
    return next(err);
  }
};

exports.login_get = (req, res) => {
  // If user is already logged in, redirect them to the homepage
  if (res.locals.currentUser) return res.redirect("/");
};
