const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verity(token, 'jwt_secret_key')
        next();
    } catch (error) {
        res.status(401).json({ message: "Token auth failed!" });
    }
}