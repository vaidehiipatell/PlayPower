import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean },
    feedback: { type: String },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    attempt: { type: Number, default: 1 },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    tips: [{ type: String }],
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, quiz: 1, attempt: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
