const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Protect routes using Clerk
exports.protect = async (req, res, next) => {
    ClerkExpressWithAuth()(req, res, async (err) => {
        if (err || !req.auth || !req.auth.userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route (Clerk)'
            });
        }
        try {
            const email = req.auth.sessionClaims?.email || req.auth.claims?.email_address;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found in local database'
                });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route (Clerk error)'
            });
        }
    });
};

// Optional: Role-based access middleware
exports.requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role not authorized to access this route`
            });
        }
        next();
    };
};