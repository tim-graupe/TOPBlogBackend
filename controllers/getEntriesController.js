const { body, validationResult } = require("express-validator");
const Entry = require("../models/newEntryModel");

exports.allEntries = async function (req, res, next) {
  try {
    const entries = await Entry.find().populate("title").exec();
    return res.status(200).json(entries);
  } catch (err) {
    return res.status(200).json({ message: "No entries found." });
  }
};

exports.singleEntry = async function (req, res, next) {
  try {
    let entry = await Entries.find({ _id: req.params.postid });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};
