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
    let entry = await Entry.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body.isPublished,
    });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};
//delete entry
exports.deleteEntry = (req, res, next) => {
  Entry.findByIdAndDelete(req.params.id)
    .then((entries) => {
      if (!entries) {
        return res.status(404).send();
      }
      res.send(entries);
    })
    .catch((error) => {
      {
        res.status(500).send(error);
      }
    });
};

exports.addReply = async function (req, res, next) {
  try {
    let entry = await Entry.findByIdAndUpdate(req.params.id, {
      $push: {
        replies: {
          user: req.body.replyUser,
          content: req.body.replyContent,
          date_replied: new Date(),
        },
      },
    });
    return res.status(200).json(entry);
  } catch (error) {
    console.log(error);
  }
};
