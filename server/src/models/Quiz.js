import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    subject: { type: String },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
