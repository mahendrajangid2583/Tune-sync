const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for authenticating JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Extract token from cookies, body, or headers
        const token = req.cookies?.token || 
        req.body?.token || 
        req.header("Authorization")?.replace("Bearer ", "");
        
        console.log("middleware reached" , token);
        // If token is missing, return unauthorized error
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded User:", decoded);
            req.user = decoded;
            console.log("middleware reached" , req.user);
            next();  // Move to next middleware or controller
        } catch (error) {
            // Handle invalid or expired token
            return res.status(401).json({
                success: false,
                message: "Session expired, please login again",
            });
        }
        
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating token",
        });
    }
};

module.exports = verifyToken;
