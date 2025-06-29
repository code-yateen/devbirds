const mongoose = require('mongoose');

const macrosSchema = new mongoose.Schema({
    protein: Number,
    carbs: Number,
    fats: Number
}, { _id: false });

const mealSchema = new mongoose.Schema({
    mealType: String,
    foods: [String],
    calories: Number,
    macros: macrosSchema
}, { _id: false });

const mealLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    meals: [mealSchema]
});

module.exports = mongoose.model('MealLog', mealLogSchema); 