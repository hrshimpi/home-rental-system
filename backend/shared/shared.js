const jwt = require('jsonwebtoken');

module.exports.generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
}
