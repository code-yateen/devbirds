const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['diet', 'workout'],
        required: [true, 'Please specify plan type']
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Please add plan content']
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now,
        get: function(date) {
            return date ? date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) : null;
        }
    },
    endDate: {
        type: Date,
        get: function(date) {
            return date ? date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) : null;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function(date) {
            return date ? date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) : null;
        }
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model('Plan', planSchema); 