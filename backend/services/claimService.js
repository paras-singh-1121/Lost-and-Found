import Item from "../models/Item.js";
import { questionBank } from "../config/questionBank.js";
import { AppError } from "../utils/AppError.js";

/*
START CLAIM SERVICE
*/
export const startClaimService = async (itemId, userId) => {
  const item = await Item.findById(itemId);
  if (!item) throw new AppError("Item not found", 404);

  if (item.reporter.toString() === userId.toString())
    throw new AppError("You cannot claim your own item", 400);

  if (item.status !== "found")
    throw new AppError("This item cannot be claimed", 400);

  // Normalize category
  const categoryKey = item.category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  const questions = questionBank[categoryKey] || questionBank.other;

  if (!questions || questions.length === 0)
    throw new AppError("No verification questions found", 400);

  const existingClaim = item.claims.find(
    (c) => c.claimer.toString() === userId.toString()
  );

  if (existingClaim) {
    if (existingClaim.status === "approved")
      throw new AppError("This claim has already been approved", 400);

    if (existingClaim.status === "rejected")
      throw new AppError("This claim was rejected", 400);

    if (existingClaim.status === "pending")
      throw new AppError("Claim submitted. Waiting for approval", 400);

    return {
      resumed: true,
      claimId: existingClaim._id,
      question: questions[existingClaim.currentStep],
    };
  }

  const newClaim = {
    claimer: userId,
    currentStep: 0,
    status: "in_progress",
    answers: [],
  };

  item.claims.push(newClaim);
  await item.save();

  const createdClaim = item.claims[item.claims.length - 1];

  return {
    resumed: false,
    claimId: createdClaim._id,
    question: questions[0],
  };
};

/*
ANSWER QUESTION SERVICE
*/
export const answerQuestionService = async (
  itemId,
  claimId,
  userId,
  answer
) => {
  const item = await Item.findById(itemId);
  if (!item) throw new AppError("Item not found", 404);

  const claim = item.claims.id(claimId);
  if (!claim) throw new AppError("Claim not found", 404);

  if (claim.claimer.toString() !== userId.toString())
    throw new AppError("Not authorized", 403);

  if (claim.status !== "in_progress")
    throw new AppError("Claim is no longer active", 400);

  // Normalize category
  const categoryKey = item.category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  const questions = questionBank[categoryKey] || questionBank.other;

  if (!questions)
    throw new AppError("No verification questions found", 400);

  if (!answer)
    throw new AppError("Answer is required", 400);

  // GET CURRENT QUESTION
  const currentQuestion = questions[claim.currentStep];

  // SAVE QUESTION + ANSWER (MAIN FIX)
  claim.answers.push({
    question: currentQuestion,
    questionIndex: claim.currentStep,
    answer,
  });

  claim.currentStep += 1;

  // FINISH
  if (claim.currentStep >= questions.length) {
    claim.status = "pending";
    await item.save();

    return { finished: true };
  }

  await item.save();

  return {
    finished: false,
    nextQuestion: questions[claim.currentStep],
  };
};

/*
APPROVE SERVICE
*/
export const approveClaimService = async (itemId, claimId, userId) => {
  const item = await Item.findById(itemId);
  if (!item) throw { statusCode: 404, message: "Item not found" };

  if (item.reporter.toString() !== userId.toString()) {
    throw { statusCode: 403, message: "Not authorized" };
  }

  const claim = item.claims.id(claimId);
  if (!claim) throw { statusCode: 404, message: "Claim not found" };

  claim.status = "approved";

  await item.save();

  return {
    claimerId: claim.claimer.toString(),
  };
};

/*
REJECT SERVICE
*/
export const rejectClaimService = async (itemId, claimId, userId) => {
  const item = await Item.findById(itemId);
  if (!item) throw new AppError("Item not found", 404);

  if (item.reporter.toString() !== userId.toString())
    throw new AppError("Only reporter can reject claims", 403);

  const claim = item.claims.id(claimId);
  if (!claim) throw new AppError("Claim not found", 404);

  if (claim.status !== "pending")
    throw new AppError("Claim is not ready for rejection", 400);

  claim.status = "rejected";

  await item.save();
};