const { body, validationResult } = require("express-validator");
const Entry = require("../models/newEntryModel");

//get all
exports.allEntries = async function (req, res, next) {
  try {
    const entries = await Entry.find().populate("title").exec();
    return res.status(200).json(entries);
  } catch (err) {
    return res.status(200).json({ message: "No entries found." });
  }
};
//get one
exports.singleEntry = async function (req, res, next) {
  try {
    let entry = await Entries.find({ _id: req.params._id });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};

//edit entry
exports.editEntry = async function (req, res, next) {
  try {
    let entry = await Entry.findByIdAndUpdate({ _id: req.params._id });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};

//delete entry
exports.deleteEntry = async (req, res, next) => {
  const entries = await Entry.find().populate("title").exec();

  Entry.findByIdAndRemove(entries, function (err, docs) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      console.log(entries + " removed...");
      res.redirect("/");
    }
  });
};
