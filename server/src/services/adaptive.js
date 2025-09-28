import { Submission } from '../models/Submission.js';

// Compute difficulty distribution based on past performance for a user on a subject
export async function computeDifficultyCounts({ userId, subject, defaultCounts = { easy: 3, medium: 2, hard: 1 } }) {
  const subs = await Submission.find({ user: userId }).populate('quiz');
  if (!subs.length) return defaultCounts;

  // Aggregate correctness by difficulty
  const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
  for (const s of subs) {
    for (const ans of s.answers) {
      const q = s.quiz?.questions?.[ans.questionIndex];
      if (!q) continue;
      const d = q.difficulty || 'easy';
      stats[d].total += 1;
      if (ans.isCorrect) stats[d].correct += 1;
    }
  }

  const accuracy = (d) => (stats[d].total ? stats[d].correct / stats[d].total : 0.6);
  // If accuracy high, increase difficulty; if low, ease it.
  const base = { ...defaultCounts };
  const medAdj = accuracy('easy') > 0.8 ? 1 : accuracy('easy') < 0.5 ? -1 : 0;
  const hardAdj = accuracy('medium') > 0.75 ? 1 : accuracy('medium') < 0.4 ? -1 : 0;

  const counts = {
    easy: Math.max(1, base.easy - Math.max(0, medAdj)),
    medium: Math.max(1, base.medium + medAdj - Math.max(0, hardAdj)),
    hard: Math.max(0, base.hard + hardAdj),
  };
  return counts;
}
