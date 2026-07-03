import express from "express";

import {
  createItem,
  createLostItem,
  getAllFoundItems,
  getAllLostItems,
  getItemById
} from "../controllers/itemController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

/*
FOUND ITEMS
*/
router.post("/", auth, createItem);
router.get("/", getAllFoundItems);

/*
LOST ITEMS
*/
router.post("/lost", auth, createLostItem);
router.get("/lost", getAllLostItems);


router.get("/:id", getItemById);

export default router;