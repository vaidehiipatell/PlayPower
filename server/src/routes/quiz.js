import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Quiz } from '../models/Quiz.js';
import { Submission } from '../models/Submission.js';
import { aiService } from '../services/aiService.js';
import { computeDifficultyCounts } from '../services/adaptive.js';

const router = express.Router();

// Generate new quiz (AI-assisted)
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { subject, grade, title, counts } = req.body || {};
    if (!subject || !grade) return res.status(400).json({ error: 'subject and grade required' });

    const adaptiveCounts = await computeDifficultyCounts({ userId: req.user.sub, subject, defaultCounts: counts || { easy: 3, medium: 2, hard: 1 } });
    const quizData = await aiService.generateQuiz({ subject, grade, counts: adaptiveCounts });

    const quiz = await Quiz.create({ ...quizData, title: title || quizData.title, createdBy: req.user.sub });
    res.status(201).json(quiz);
  } catch (e) {
    next(e);
  }
});

// Submit quiz answers and get evaluation
router.post('/:quizId/submit', requireAuth, async (req, res, next) => {
  try {
    const { answers } = req.body || {};
    if (!Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: 'answers array required' });

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const evaluation = await aiService.evaluate(quiz.toObject(), answers);

    const lastAttempt = await Submission.find({ user: req.user.sub, quiz: quiz._id }).sort({ attempt: -1 }).limit(1);
    const attempt = (lastAttempt[0]?.attempt || 0) + 1;

    const submission = await Submission.create({
      user: req.user.sub,
      quiz: quiz._id,
      attempt,
      answers: evaluation.evaluated,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      tips: evaluation.tips?.slice(0, 2) || [],
    });

    res.status(201).json(submission);
  } catch (e) {
    next(e);
  }
});

// Retry a quiz (alias of submit but keeps old submissions accessible)
router.post('/:quizId/retry', requireAuth, async (req, res, next) => {
  try {
    // Same as submit, but explicit endpoint for clarity
    req.url = `/${req.params.quizId}/submit`;
    return router.handle(req, res, next);
  } catch (e) {
    next(e);
  }
});

// Hint generation for a question
router.get('/:quizId/hint/:questionIndex', requireAuth, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const idx = parseInt(req.params.questionIndex, 10);
    const hint = await aiService.hint(quiz.toObject(), idx);
    res.json({ hint });
  } catch (e) {
    next(e);
  }
});

// History retrieval with filters and date range
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const { subject, grade, minScore, maxScore, from, to, limit } = req.query;

    const quizMatch = {};
    if (subject) quizMatch.subject = subject;
    if (grade) quizMatch.grade = grade;

    const subMatch = { user: req.user.sub };
    if (minScore) subMatch.score = { ...(subMatch.score || {}), $gte: Number(minScore) };
    if (maxScore) subMatch.score = { ...(subMatch.score || {}), $lte: Number(maxScore) };
    if (from || to) {
      subMatch.createdAt = {};
      if (from) subMatch.createdAt.$gte = new Date(from);
      if (to) subMatch.createdAt.$lte = new Date(to);
    }

    const pipeline = [
      { $match: subMatch },
      { $lookup: { from: 'quizzes', localField: 'quiz', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' },
      { $match: quizMatch },
      { $sort: { createdAt: -1 } },
      ...(limit ? [{ $limit: Number(limit) }] : []),
    ];

    const data = await Submission.aggregate(pipeline);
    res.json({ results: data });
  } catch (e) {
    next(e);
  }
});

// Leaderboard (bonus): top scores per subject/grade
router.get('/leaderboard', requireAuth, async (req, res, next) => {
  try {
    const { subject, grade, limit = 10 } = req.query;
    const pipeline = [
      { $lookup: { from: 'quizzes', localField: 'quiz', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' },
      ...(subject ? [{ $match: { 'quiz.subject': subject } }] : []),
      ...(grade ? [{ $match: { 'quiz.grade': grade } }] : []),
      { $sort: { score: -1 } },
      { $limit: Number(limit) },
      { $project: { score: 1, maxScore: 1, user: 1, createdAt: 1, 'quiz.subject': 1, 'quiz.grade': 1 } },
    ];
    const top = await Submission.aggregate(pipeline);
    res.json({ results: top });
  } catch (e) {
    next(e);
  }
});

export default router;
