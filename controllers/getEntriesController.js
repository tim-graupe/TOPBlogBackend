const { body, validationResult } = require("express-validator");
const Entry = require("../models/newEntryModel");

//get all
exports.allEntries = async function (req, res, next) {
  try {
    const entry = await Entry.find().populate("title").exec();
    return res.status(200).json(entry);
  } catch (err) {
    return res.status(200).json({ message: "No entries found." });
  }
};
//get one
exports.singleEntry = async function (req, res, next) {
  try {
    let entry = await Entry.find({ _id: req.params.id });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};

//edit entry
exports.editEntry = async function (req, res, next) {
  try {
    let entry = await Entry.findByIdAndUpdate({ _id: req.params.id });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};

//delete entry
exports.deleteEntry = async (req, res, next) => {
  const entry = await Entry.find({ _id: req.params.id });
  entry.findByIdAndRemove(entry, function (err, docs) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      console.log(entry + " removed...");
      res.redirect("/");
    }
  });
};
