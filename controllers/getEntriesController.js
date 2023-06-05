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
exports.deleteEntry = (req, res, next) => {
  Entry.findByIdAndDelete({ id: req.params.id });
  res.status(200).json(Entry);
  //switched from findByIdAndRemove
};
