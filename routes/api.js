var express = require("express");
var router = express.Router();
const passport = require("passport");
const new_entry_controller = require("../controllers/newEntryController");
const get_entries_controller = require("../controllers/getEntriesController");
const auth_controller = require("../controllers/authController");

/* GET home page. */

router.get("/", (req, res) => {
  return res.send("GET HTTP method on user resource");
});

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
  return res.send("GET HTTP method on sign up", { user: req.user });
});
router.post("/sign_up", auth_controller.sign_up_controller);

//login
router.post("/login", auth_controller.login_post);
module.exports = router;
