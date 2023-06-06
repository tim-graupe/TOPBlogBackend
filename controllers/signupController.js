const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");

exports.sign_up_controller = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      adminCode: req.body.adminCode,
      //   isAdmin: req.body.adminCode === process.env.passcode ? true : false,
    });
    const result = await user.save();
  } catch (err) {
    console.log("Error was found: " + err);
  }
};
