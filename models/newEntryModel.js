const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const EntrySchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 24 },
  content: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  //   user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_posted: { type: Date, default: new Date() },
  isPublished: { type: Boolean, default: false },
  replies: { type: Array },
});

EntrySchema.virtual("url").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

EntrySchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toISODate();
});

// Export model
module.exports = mongoose.model("Entry", EntrySchema);
