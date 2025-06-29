const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Please add age']
    },
    height: {
        type: Number,
        required: [true, 'Please add height']
    },
    weight: {
        type: Number,
        required: [true, 'Please add weight']
    },
    fitnessGoal: {
        type: String,
        enum: ['bulk', 'cut', 'maintain'],
        required: [true, 'Please specify fitness goal']
    },
    dietPreference: {
        type: String,
        enum: ['vegetarian', 'nonVegetarian', 'eggetarian'],
        required: [true, 'Please specify diet preference']
    },
    allergies: {
        type: String,
        default: ''
    },
    lifestyle: {
        type: String,
        enum: ['sedentary', 'lightlyActive', 'active', 'veryActive', 'extraActive'],
        required: [true, 'Please specify lifestyle']
    },
    budget: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Please specify budget']
    }
});

module.exports = mongoose.model('User', userSchema); 