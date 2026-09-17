const express = require("express")

const { createClient } = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()

router.post("/", authMiddleware, createClient);

module.exports = router;
