var express = require("express");
var router = express.Router();
const new_entry_controller = require("../controllers/newEntryController");
/* GET home page. */

router.get("/", (req, res) => {
  return res.send("GET HTTP method on user resource");
});

router.post("/", (req, res) => {
  return res.send("POST HTTP method on user resource");
});

router.put("/", (req, res) => {
  return res.send("PUT HTTP method on user resource");
});

router.delete("/", (req, res) => {
  return res.send("DELETE HTTP method on user resource");
});

//new entry
router.get("/new_entry", (req, res) => {
  return res.send("New entry");
});

router.post("/new_entry", new_entry_controller.new_entry_post);
module.exports = router;
