const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();


// send otp
exports.sendOTP = async (req, res) => {
    try {
        //fatch email
        const { email } = req.body;
         
        console.log("email" , email);
        // check if user already exist
        const checkUserExist = await User.findOne({ email: email })
        // if user already exist than return a response

        if (checkUserExist) {
            return res.json({
                success: false,
                message: "User already registered"
            });
        }

        //generate otp
        let otp = optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        // console.log("genereted opt: ", otp);

        //check unique otp or not
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = optGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: opt });
        }

        const otpPayload = { email, otp };
        console.log("otppayload" , otpPayload);
        result = await OTP.findOne({ email: email });
        if (result) {
            // delete the current otp.
            await OTP.findByIdAndDelete(result._id);
        }
        //create an entry for OTP 
        const otpbody = await OTP.create(otpPayload);
        // console.log(otpbody);

        //return response successful
        res.status(200).json({
            success: true,
            message: "OTP Sent successfully",
            
        });

    } catch (error) {
        console.log("error while sending Otp", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//signUp
exports.signUp = async (req, res) => {
    try {
        // Fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            Username
        } = req.body.Data;
        

        // Hash password
        console.log(firstName, lastName, email, password, Username);

        const hashedPassword = await bcrypt.hash(String(password), 10);

        // Create user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            Username: Username,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Convert Mongoose document to plain object and exclude password
        const userObject = user.toObject();
        delete userObject.password;  // Remove password from response

        const token = jwt.sign({ id: userObject._id, email: userObject.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN, // Example: '7d'
        });

        // res.cookie("token", token, {
        //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //   });

        // Return the created user object
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: userObject,  // Returning cleaned user object
            token: token,
        });

    } catch (error) {
        console.error("Error while signUp:", error);
        return res.status(200).json({
            success: false,
            message: "Error occurred while signing up",
            error: error.message, // Sending only error message
        });
    }
};



exports.IsValidUsername = async (req, res) => {
    const { Username } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ Username });
    try {
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "Username already in use"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Username is available"
        });
    } catch (error) {
        console.error("Error checking Username:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


exports.IsValidEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user already exists with the provided email
        const existingUser = await User.findOne({ email: email });
        console.log("function called");
        if (existingUser) {
            // If user is found, return response indicating that the email is already taken
            return res.status(200).json({
                success: false,
                message: "Email already in use"
            });
        }

        // If no user is found, the email is valid and not in use
        return res.status(200).json({
            success: true,
            message: "Email is available"
        });

    } catch (error) {
        // Catch and log any errors
        console.error("Error checking email:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.IsvalidOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Check if user already exists with the provided email
        const validation = await OTP.findOne({ email: email, otp: otp });

        if (validation) {
            return res.status(200).json({
                success: true,
                message: "Valid Otp"
            });
        }


        return res.status(200).json({
            success: false,
            message: "Invalid Otp"
        });



    } catch (error) {
        // Catch and log any errors
        console.error("Error checking email:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


//login
exports.login = async (req, res) => {
    try {
        //fetch data
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All field are required",
            });
        }

        //check if user exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User is not registered"
            })
        }
        //verify password

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.azccountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d",
            });
            user.token = token;
            user.password = undefined;

            //Create Cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successFully",
            })
        }
        else {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

        //generate JWT token
    } catch (error) {
        console.log("Error while login", error);
        return res.status(500).json({
            success: false,
            message: "Login failure ,please try again leter"
        });
    }
}

