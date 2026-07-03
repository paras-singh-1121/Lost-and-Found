import express from "express";
import auth from "../middleware/auth.js";
import {
  startClaim,
  answerQuestion,
  approveClaim,
  rejectClaim,
  getClaimsForItem
} from "../controllers/claimController.js";

const router = express.Router();

router.post("/:itemId/start", auth, startClaim);
router.post("/:itemId/:claimId/answer", auth, answerQuestion);
router.patch("/:itemId/:claimId/approve", auth, approveClaim);
router.patch("/:itemId/:claimId/reject", auth, rejectClaim);
router.get("/:itemId", auth, getClaimsForItem);

export default router;