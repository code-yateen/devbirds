const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const { protect } = require('../middleware/auth');

// GET /api/trainers - List all trainers
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find({}, '-password');
        res.json({ success: true, trainers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/trainers/:trainerId - Get details of a specific trainer
router.get('/:trainerId', async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.trainerId, '-password');
        if (!trainer) return res.status(404).json({ success: false, error: 'Trainer not found' });
        res.json({ success: true, trainer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/trainers/contact - Contact a trainer
router.post('/contact', protect, async (req, res) => {
    try {
        const { trainerId, message, contactPreference } = req.body;
        // Stub: In a real app, send email/notification to trainer
        res.json({ success: true, message: 'Contact request sent (stub)', trainerId, contactPreference });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router; 