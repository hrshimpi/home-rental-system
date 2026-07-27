const jwt = require('jsonwebtoken');

module.exports.generateToken = (id, role) => {
    return jwt.sign({ id, role }, 'JWT_SECRET_KEY',{
        expiresIn: 3 * 24 * 60 * 60
    });
}
