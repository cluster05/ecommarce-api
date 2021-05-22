var jwt = require('jsonwebtoken');

const tokenBuilderCred = {
    tokenSecret: 'TOKEN_SECRET_FOR_JWT',
    expiresIn: '12h'
}

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, tokenBuilderCred.tokenSecret);
        req.credentails = decoded;
        next()
    } catch (err) {
        return res.status(409).json({
            method: req.method,
            error: 409,
            massage: 'invalid user access',
        })
    }
}