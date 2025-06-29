const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// GET /api/analytics/workouts
router.get('/workouts', protect, async (req, res) => {
    const { period } = req.query;
    // Stubbed analytics data
    res.json({
        success: true,
        period,
        stats: {
            totalWorkouts: 10,
            avgDuration: 45,
            caloriesBurned: 3000
        }
    });
});

// GET /api/analytics/nutrition
router.get('/nutrition', protect, async (req, res) => {
    const { period } = req.query;
    // Stubbed analytics data
    res.json({
        success: true,
        period,
        stats: {
            avgCalories: 2200,
            protein: 120,
            carbs: 250,
            fats: 70
        }
    });
});

module.exports = router; 