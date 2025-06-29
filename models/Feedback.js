const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    // For testimonials
    name: String,
    email: String,
    subject: String,
    message: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    approved: {
        type: Boolean,
        default: false
    },
    // For plan feedbacks
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 