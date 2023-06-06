const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const ReplySchema = new Schema({
  user: { type: String, required: false, maxLength: 24 },
  content: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 2000,
  },
});

ReplySchema.virtual("url").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

ReplySchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toISODate();
});

// Export model
module.exports = mongoose.model("Reply", ReplySchema);
