const { body, validationResult } = require("express-validator");
const Reply = require("../models/newReplyModel");
const asyncHandler = require("express-async-handler");

exports.new_entry_post = async (req, res) => {
  try {
    const entry = new Reply({
      title: req.body.title,
      content: req.body.content,
      date_posted: Date.now(),
      isPublished: req.body.isPublished,
    });
    entry.save();
    console.log(entry);
    res.status(200).json({
      message: "created ",
      entry,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error, data not created!",
    });
  }
};
