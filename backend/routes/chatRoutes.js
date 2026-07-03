import express from "express";
import auth from "../middleware/auth.js";

import {
  sendMessage,
  getMessages,
  getChatList,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/list/all", auth, getChatList);

// SEND MESSAGE
router.post("/send", auth, sendMessage);

// GET CHAT HISTORY
router.get("/:userId/:itemId", auth, getMessages);

export default router;