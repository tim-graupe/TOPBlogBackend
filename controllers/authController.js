const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET,
// };

exports.login_post = (req, res, next) => {
  passport.authenticate(
    "local",
    {
      successRedirect: "/",
      failureRedirect: "/sign_up",
      passReqToCallback: true,
    },
    { session: false }
  );
  console.log("req.body ==> ", req.body);

  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user,
    username: req.username,
    userTwo: req.body.user,
  });
};

exports.login_post = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare the provided password with the stored password
      user.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ message: "Authentication failed." });
        }

        // Generate a signed JWT
        const token = jwt.sign({ id: user._id }, jwtOptions.secretOrKey);

        // Send the token in the response
        return res.json({ token });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error." });
    });
};
