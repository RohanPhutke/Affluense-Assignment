const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { getInsights } = require("../controllers/dashboardController")

const router = express.Router()

router.get("/insights", authMiddleware, getInsights);

module.exports = router;