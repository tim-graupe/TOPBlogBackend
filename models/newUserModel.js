const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 2, maxLength: 24 },
  password: { type: String, required: true, minLength: 6 },
  adminCode: { type: String, required: false },
  isAdmin: { type: Boolean, required: false },
  savedPosts: { type: Array },
});

module.exports = mongoose.model("User", UserSchema);
