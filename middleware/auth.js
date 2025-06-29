const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

// Protect routes using Clerk
exports.protect = async (req, res, next) => {
    // Use Clerk's middleware to attach auth info
    ClerkExpressWithAuth()(req, res, async (err) => {
        if (err || !req.auth || !req.auth.userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route (Clerk)'
            });
        }
        try {
            // Clerk user info is available in req.auth
            // You may want to fetch more user info from Clerk if needed
            // For now, we use email from Clerk claims to find Trainer/Member
            const email = req.auth.sessionClaims?.email || req.auth.claims?.email_address;
            let user = await Trainer.findOne({ email });
            let userType = 'Trainer';
            if (!user) {
                user = await Member.findOne({ email });
                userType = user ? 'Member' : null;
            }
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found in local database'
                });
            }
            req.user = user;
            req.user.userType = userType;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route (Clerk error)'
            });
        }
    });
};

// Grant access to specific user types
exports.authorize = (...userTypes) => {
    return (req, res, next) => {
        if (!userTypes.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                error: `User type ${req.user.userType} is not authorized to access this route`
            });
        }
        next();
    };
}; 