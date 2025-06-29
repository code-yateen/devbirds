const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Plan = require('../models/Plan');

// Helper function to convert dd-mm-yyyy to Date object
const convertToDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// @desc    Create a plan
// @route   POST /api/plans
// @access  Private (Trainer only)
router.post('/', protect, authorize('Trainer'), async (req, res) => {
    try {
        const plan = await Plan.create({
            ...req.body,
            trainer: req.user.id
        });

        res.status(201).json({
            success: true,
            data: plan
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Get all plans for a trainer
// @route   GET /api/plans/trainer
// @access  Private (Trainer only)
router.get('/trainer', protect, authorize('Trainer'), async (req, res) => {
    try {
        const plans = await Plan.find({ trainer: req.user.id })
            .populate('member', 'name email');

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Get all plans for a member
// @route   GET /api/plans/member
// @access  Private (Member only)
router.get('/member', protect, authorize('Member'), async (req, res) => {
    try {
        const plans = await Plan.find({ member: req.user.id })
            .populate('trainer', 'name email');

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id)
            .populate('trainer', 'name email')
            .populate('member', 'name email');

        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Plan not found'
            });
        }

        // Make sure user is either the trainer or member
        if (plan.trainer._id.toString() !== req.user.id && 
            plan.member._id.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this plan'
            });
        }

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private (Trainer only)
router.put('/:id', protect, authorize('Trainer'), async (req, res) => {
    try {
        let plan = await Plan.findById(req.params.id);

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
                error: 'Not authorized to update this plan'
            });
        }

        plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private (Trainer only)
router.delete('/:id', protect, authorize('Trainer'), async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

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
                error: 'Not authorized to delete this plan'
            });
        }

        await plan.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router; 