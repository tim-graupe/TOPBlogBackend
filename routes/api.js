var express = require("express");
var router = express.Router();
const cors = require("cors");
const new_entry_controller = require("../controllers/newEntryController");
const get_entries_controller = require("../controllers/getEntriesController");
/* GET home page. */

router.get("/", (req, res) => {
  return res.send("GET HTTP method on user resource");
});

//new entry
router.get("/new_entry", (req, res) => {
  return res.send("New entry");
});

//all entries
router.get("/entries", get_entries_controller.allEntries);

//single entry
router.get(`/entries/:id`, get_entries_controller.singleEntry);

router.post("/new_entry", new_entry_controller.new_entry_post);
module.exports = router;
