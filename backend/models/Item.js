import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
  claimer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  answers: [
    {
      question: String,
      questionIndex: Number,
      answer: String
    }
  ],
  currentStep: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["in_progress", "pending", "approved", "rejected"],
    default: "in_progress"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["lost", "found", "returned"], required: true },
  description: String,
  imageUrl: String,
  location: String,
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  claims: [ClaimSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Item", ItemSchema);
