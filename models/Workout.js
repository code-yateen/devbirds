const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
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
    lifestyle: {
        type: String,
        required: true
    },
    experience: {
        type: String
    },
    preferences: {
        type: Object
    },
    plan: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema); 