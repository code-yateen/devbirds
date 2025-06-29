const mongoose = require('mongoose');

const completedExerciseSchema = new mongoose.Schema({
    exerciseId: String,
    sets: Number,
    reps: mongoose.Schema.Types.Mixed,
    weight: Number,
    completed: Boolean
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutDayId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completedExercises: [completedExerciseSchema]
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema); 