const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DietPlan = require('../models/DietPlan');
const MealLog = require('../models/MealLog');

// GET /api/diets
router.get('/', protect, async (req, res) => {
    try {
        const { goal, preference } = req.query;
        const query = { user: req.user._id };
        if (goal) query.fitnessGoal = goal;
        if (preference) query.dietPreference = preference;
        // Return the most recent plan matching the query
        const plan = await DietPlan.findOne(query).sort({ createdAt: -1 });
        if (!plan) return res.status(404).json({ success: false, error: 'No diet plan found' });
        res.json({ success: true, plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/diets/generate
router.post('/generate', protect, async (req, res) => {
    try {
        const { fitnessGoal, dietPreference, allergies, budget } = req.body;
        // Generate a stub plan (replace with real logic as needed)
        const plan = {
            days: [
                { day: 'Monday', meals: ['Oats', 'Salad', 'Rice & Lentils'] },
                { day: 'Tuesday', meals: ['Eggs', 'Chicken', 'Broccoli'] },
                { day: 'Wednesday', meals: ['Paneer', 'Quinoa', 'Beans'] },
                { day: 'Thursday', meals: ['Tofu', 'Rice', 'Spinach'] },
                { day: 'Friday', meals: ['Fish', 'Sweet Potato', 'Peas'] },
                { day: 'Saturday', meals: ['Yogurt', 'Fruit', 'Chicken'] },
                { day: 'Sunday', meals: ['Eggs', 'Rice', 'Vegetables'] }
            ],
            notes: 'Generated based on profile.'
        };
        const dietPlan = new DietPlan({
            user: req.user._id,
            fitnessGoal,
            dietPreference,
            allergies,
            budget,
            plan
        });
        await dietPlan.save();
        res.status(201).json({ success: true, dietPlan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/diets/:dietPlanId
router.put('/:dietPlanId', protect, async (req, res) => {
    try {
        const updated = await DietPlan.findOneAndUpdate(
            { _id: req.params.dietPlanId, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, error: 'Diet plan not found' });
        res.json({ success: true, dietPlan: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/diets/log
router.post('/log', protect, async (req, res) => {
    try {
        const { date, meals } = req.body;
        const log = new MealLog({
            user: req.user._id,
            date,
            meals
        });
        await log.save();
        res.status(201).json({ success: true, log });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/diets/log/:date
router.get('/log/:date', protect, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        // Find logs for the user on the given date
        const logs = await MealLog.find({
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