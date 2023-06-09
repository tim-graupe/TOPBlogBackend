var express = require("express");
var router = express.Router();
const passport = require("passport");
const new_entry_controller = require("../controllers/newEntryController");
const get_entries_controller = require("../controllers/getEntriesController");
const auth_controller = require("../controllers/authController");
const cors = require("cors");

/* GET home page. */

router.get("/", passport.authenticate("jwt"), (req, res) => {
  res.json(req.user);
});

//login
router.post("/log_in", cors(), auth_controller.login_post);
router.get("/log_in", passport.authenticate("jwt"), (req, res) => {
  // This route is now protected, and `req.user` will contain the authenticated user object.
  res.json(req.user);
});

//logout
router.get("/log_out", auth_controller.logout_get);
//new entry
router.get("/new_entry", (req, res) => {
  return res.send("New entry");
});
router.post("/new_entry", new_entry_controller.new_entry_post);

//all entries
router.get("/entries", get_entries_controller.allEntries);

//single entry
router.get("/entries/:id", get_entries_controller.singleEntry);

//edit entry
router.put("/entries/:id", get_entries_controller.editEntry);

//delete entry
router.delete("/entries/:id", get_entries_controller.deleteEntry);

//add reply
router.post("/entries/:id", get_entries_controller.addReply);

//sign up
router.get("/sign_up", (req, res) => {
  return res.send("GET HTTP method on sign up");
});
router.post("/sign_up", auth_controller.sign_up_controller);

module.exports = router;
