const express = require("express");
const router = express.Router();
const mainController = require("../controllers/controller-main");

router.get("/", mainController.main);

module.exports = router;
