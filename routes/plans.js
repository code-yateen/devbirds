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

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private (Trainer only)
router.post('/', protect, authorize('trainer'), async (req, res) => {
    try {
        const planData = {
            ...req.body,
            trainer: req.user.id
        };

        // Convert endDate from dd-mm-yyyy to Date object if provided
        if (planData.endDate) {
            planData.endDate = convertToDate(planData.endDate);
        }

        const plan = await Plan.create(planData);

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
router.get('/trainer', protect, authorize('trainer'), async (req, res) => {
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
router.get('/member', protect, authorize('member'), async (req, res) => {
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

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private (Trainer only)
router.put('/:id', protect, authorize('trainer'), async (req, res) => {
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

        const updateData = { ...req.body };

        // Convert endDate from dd-mm-yyyy to Date object if provided
        if (updateData.endDate) {
            updateData.endDate = convertToDate(updateData.endDate);
        }

        plan = await Plan.findByIdAndUpdate(req.params.id, updateData, {
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
router.delete('/:id', protect, authorize('trainer'), async (req, res) => {
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