const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = (roles = []) => {
    if(typeof roles === 'string') roles = [roles];

    return (req, res, next) => {
        const token = req.headers['Authorization'];
        if(!token) {
            return res.status(401).json({
                status: 'UNAUTHORIZED',
                message: `You're Not Authorized!`,
                data: null
            });
        }

        const payload = jwt.verify(token, JWT_SECRET_KEY);
        req.user = payload;

        if(roles.length > 0 && !roles.includes(payload.role)) {
            return res.status(401).json({
                status: 'UNAUTHORIZED',
                message: `You're Not Authorized!`,
                data: null
            });
        }

        next();
    }
}