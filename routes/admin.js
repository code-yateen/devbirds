const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

// Admin role check middleware
function requireAdmin(req, res, next) {
    ClerkExpressWithAuth()(req, res, () => {
        const role = req.auth?.sessionClaims?.role || req.auth?.claims?.role;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }
        next();
    });
}

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/feedback
router.get('/feedback', requireAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json({ success: true, feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router; 