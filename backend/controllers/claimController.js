import Item from "../models/Item.js";

import {
  startClaimService,
  answerQuestionService,
  approveClaimService,
  rejectClaimService
} from "../services/claimService.js";


export const startClaim = async (req, res) => {
  try {
    const result = await startClaimService(
      req.params.itemId,
      req.user._id
    );

    // If claim already existed → resume (200)
    if (result.resumed) {
      return res.status(200).json({
        claimId: result.claimId,
        question: result.question
      });
    }

    // If new claim created → 201
    return res.status(201).json({
      claimId: result.claimId,
      question: result.question
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error"
    });
  }
};


export const answerQuestion = async (req, res) => {
  try {
    const result = await answerQuestionService(
      req.params.itemId,
      req.params.claimId,
      req.user._id,
      req.body.answer
    );

    if (result.finished) {
      return res.status(200).json({
        message: "All questions answered. Waiting for finder approval."
      });
    }

    return res.status(200).json({
      nextQuestion: result.nextQuestion
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error"
    });
  }
};


export const approveClaim = async (req, res) => {
  try {
    const result = await approveClaimService(
      req.params.itemId,
      req.params.claimId,
      req.user._id
    );

    return res.status(200).json({
      message: "Claim approved",
      claimerId: result.claimerId, // ✅ ADD THIS
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error"
    });
  }
};


export const rejectClaim = async (req, res) => {
  try {
    await rejectClaimService(
      req.params.itemId,
      req.params.claimId,
      req.user._id
    );

    return res.status(200).json({
      message: "Claim rejected"
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error"
    });
  }
};


export const getClaimsForItem = async (req, res) => {
  try {

    const { itemId } = req.params;

    const item = await Item.findById(itemId)
      .populate("claims.claimer", "name email") // ✅ VERY IMPORTANT

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item.claims);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};