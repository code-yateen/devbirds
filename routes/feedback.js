const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Plan = require('../models/Plan');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (Member only)
router.post('/', protect, authorize('Member'), async (req, res) => {
    try {
        // Check if plan exists and belongs to member
        const plan = await Plan.findOne({
            _id: req.body.plan,
            member: req.user.id
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Plan not found or not assigned to you'
            });
        }

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({
            plan: req.body.plan,
            member: req.user.id
        });

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                error: 'Feedback already submitted for this plan'
            });
        }

        const feedback = await Feedback.create({
            ...req.body,
            member: req.user.id
        });

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Get feedback for a plan
// @route   GET /api/feedback/plan/:planId
// @access  Private (Trainer only)
router.get('/plan/:planId', protect, authorize('Trainer'), async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.planId);

        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Plan not found'
            });
        }

        // Make sure trainer owns the plan
        if (plan.trainer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to view feedback for this plan'
            });
        }

        const feedback = await Feedback.findOne({ plan: req.params.planId })
            .populate('member', 'name email');

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Get all feedback for a trainer
// @route   GET /api/feedback/trainer
// @access  Private (Trainer only)
router.get('/trainer', protect, authorize('Trainer'), async (req, res) => {
    try {
        const plans = await Plan.find({ trainer: req.user.id });
        const planIds = plans.map(plan => plan._id);

        const feedback = await Feedback.find({ plan: { $in: planIds } })
            .populate('member', 'name email')
            .populate('plan', 'title type');

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// POST /api/feedback
router.post('/', protect, async (req, res) => {
    try {
        const { name, email, subject, message, rating } = req.body;
        const feedback = new Feedback({
            name,
            email,
            subject,
            message,
            rating,
            approved: false
        });
        await feedback.save();
        res.status(201).json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/feedback/testimonials
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Feedback.find({ approved: true });
        res.json({ success: true, testimonials });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router; 