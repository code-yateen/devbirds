const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fitnessGoal: {
        type: String,
        enum: ['bulk', 'cut', 'maintain'],
        required: true
    },
    dietPreference: {
        type: String,
        enum: ['vegetarian', 'nonVegetarian', 'eggetarian'],
        required: true
    },
    allergies: {
        type: String
    },
    budget: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    plan: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema); 