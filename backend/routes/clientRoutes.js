const express = require("express")

const { createClient, getClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()

router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClients);
router.get("/:clientId", authMiddleware, getClientById );
router.patch("/:clientId", authMiddleware, updateClient );
router.delete("/:clientId", authMiddleware, deleteClient);

module.exports = router;
