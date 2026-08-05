const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'invalid or expired token' });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch (error) {
        // Distinguished server-side (useful for logs/monitoring) but
        // never in the response - the client always gets the same
        // generic message, whether the token was expired or invalid,
        // so a caller can't use the difference to fingerprint tokens.
        if (error instanceof jwt.TokenExpiredError) {
            console.log('auth: token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.log('auth: invalid token -', error.message);
        }
        res.status(401).send({ message: 'invalid or expired token' });
    }
}

// Gap found while writing Day 5's tests: verifyToken only checks that
// *some* valid token was presented - nothing anywhere checked that its
// role actually matched the route. A tenant with a valid token could
// call POST /addProperty/:id and successfully create a property, then
// "own" it as far as editProperty's ownership check is concerned,
// despite never being an owner by role. Mount after verifyToken (needs
// req.user to already be set).
module.exports.requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).send({ message: 'You do not have permission to perform this action.' });
    }
    next();
}
