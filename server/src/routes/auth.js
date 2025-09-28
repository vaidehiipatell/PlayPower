import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Mock auth: accepts any username/password and returns a JWT
router.post('/login', async (req, res, next) => {
  try {
    const { username, password, email } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username, email });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (e) {
    next(e);
  }
});

export default router;
