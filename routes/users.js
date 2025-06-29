const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Progress = require('../models/Progress');

// GET /api/users/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).json({ success: false, error: 'User profile not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/users/profile (create or update)
router.post('/profile', protect, async (req, res) => {
    try {
        const update = req.body;
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            update,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/users/progress
router.get('/progress', protect, async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id }).sort({ dateRecorded: -1 });
        res.json({ success: true, progress });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/users/progress
router.post('/progress', protect, async (req, res) => {
    try {
        const entry = new Progress({ ...req.body, user: req.user._id });
        await entry.save();
        res.status(201).json({ success: true, progress: entry });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router; 