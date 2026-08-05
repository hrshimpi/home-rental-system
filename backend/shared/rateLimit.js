const rateLimit = require('express-rate-limit');

// Blunts brute-force / credential-stuffing: 5 attempts per 15 minutes
// per IP. standardHeaders/legacyHeaders are both off on purpose -
// express-rate-limit's default RateLimit-* headers report the exact
// remaining-attempts count on every response, which is exactly the
// kind of detail an attacker probing the limit shouldn't get for
// free.
const makeAuthRateLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    // A real test run legitimately makes far more than 5 login/signUp
    // calls across its test cases - NODE_ENV=test is never set outside
    // local/CI test runs (Jest sets it by default), so this doesn't
    // weaken the real 5/15min production limit.
    max: process.env.NODE_ENV === 'test' ? 1000 : 5,
    standardHeaders: false,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many attempts. Please try again later.' });
    },
});

// Separate instances (and so separate counters) for login and signUp -
// brute-forcing a password and mass-creating accounts are different
// abuse patterns, and sharing one limiter between the two routes would
// let either one burn through the other's budget.
const loginRateLimiter = makeAuthRateLimiter();
const signUpRateLimiter = makeAuthRateLimiter();

module.exports = { loginRateLimiter, signUpRateLimiter };
