const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                error : {
                    code : "UNAUTHORIZED",
                    message : "Authentication Required"
                }
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.advisorId = decoded.advisorId;

        next();

    } catch (error) {
       return res.status(401).json({
                error : {
                    code : "UNAUTHORIZED",
                    message : "Invalid or auth required"
                }
        })
    }
}

module.exports = authMiddleware;
