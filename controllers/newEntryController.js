const { body, validationResult } = require("express-validator");
const Entry = require("../models/newEntryModel");
const asyncHandler = require("express-async-handler");

exports.new_entry_post = async (req, res) => {
  try {
    const entry = new Entry({
      title: req.body.title,
      content: req.body.content,
      date_posted: req.body.date_posted,
      isPublished: req.body.isPublished,
      replies: [],
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
