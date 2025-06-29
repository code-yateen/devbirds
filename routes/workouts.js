const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Workout = require('../models/Workout');
const WorkoutLog = require('../models/WorkoutLog');

// GET /api/workouts
router.get('/', protect, async (req, res) => {
    // For now, return a stub workout plan
    const { goal } = req.query;
    res.json({
        success: true,
        plan: {
            goal: goal || 'maintain',
            days: [
                { day: 'Monday', workout: 'Push' },
                { day: 'Tuesday', workout: 'Pull' },
                { day: 'Wednesday', workout: 'Legs' },
                { day: 'Thursday', workout: 'Rest' },
                { day: 'Friday', workout: 'Push' },
                { day: 'Saturday', workout: 'Pull' },
                { day: 'Sunday', workout: 'Legs' }
            ]
        }
    });
});

// POST /api/workouts/generate
router.post('/generate', protect, async (req, res) => {
    try {
        const { fitnessGoal, lifestyle, experience, preferences } = req.body;
        // Generate a stub plan based on input (replace with real logic as needed)
        const plan = {
            days: [
                { day: 'Monday', workout: 'Push' },
                { day: 'Tuesday', workout: 'Pull' },
                { day: 'Wednesday', workout: 'Legs' },
                { day: 'Thursday', workout: 'Rest' },
                { day: 'Friday', workout: 'Push' },
                { day: 'Saturday', workout: 'Pull' },
                { day: 'Sunday', workout: 'Legs' }
            ],
            notes: 'Generated based on profile.'
        };
        const workout = new Workout({
            user: req.user._id,
            fitnessGoal,
            lifestyle,
            experience,
            preferences,
            plan
        });
        await workout.save();
        res.status(201).json({ success: true, workout });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/workouts/:workoutId
router.put('/:workoutId', protect, async (req, res) => {
    try {
        const updated = await Workout.findOneAndUpdate(
            { _id: req.params.workoutId, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, error: 'Workout not found' });
        res.json({ success: true, workout: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/workouts/history
router.get('/history', protect, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, workouts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/workouts/log
router.post('/log', protect, async (req, res) => {
    try {
        const { workoutDayId, date, completedExercises } = req.body;
        const log = new WorkoutLog({
            user: req.user._id,
            workoutDayId,
            date,
            completedExercises
        });
        await log.save();
        res.status(201).json({ success: true, log });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/workouts/log/:date
router.get('/log/:date', protect, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        // Find logs for the user on the given date
        const logs = await WorkoutLog.find({
            user: req.user._id,
            date: {
                $gte: new Date(date.setHours(0,0,0,0)),
                $lte: new Date(date.setHours(23,59,59,999))
            }
        });
        res.json({ success: true, logs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router; 