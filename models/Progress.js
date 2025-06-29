const mongoose = require('mongoose');

const measurementsSchema = new mongoose.Schema({
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    legs: Number
}, { _id: false });

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    dateRecorded: {
        type: Date,
        required: true,
        default: Date.now
    },
    measurements: measurementsSchema,
    notes: String
});

module.exports = mongoose.model('Progress', progressSchema); 