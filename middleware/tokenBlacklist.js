// In-memory token blacklist
const blacklistedTokens = new Set();

// Add token to blacklist
const addToBlacklist = (token) => {
    blacklistedTokens.add(token);
};

// Check if token is blacklisted
const isBlacklisted = (token) => {
    return blacklistedTokens.has(token);
};

module.exports = {
    addToBlacklist,
    isBlacklisted
}; 