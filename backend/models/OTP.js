// Your OTPSchema file
const mongoose = require("mongoose");
const sender = require("../utils/mailSender");  // Now you can directly use 'sender'
const emailTemplate = require("../mail/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 300, // The document will be automatically deleted after 5 minutes
    }
});

// Function to send emails
async function sendVerificationOnEmail(email, otp) {
    try {
        const mailResponse = await sender(email, "Verification Email from TuneSync", emailTemplate(otp));
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending mail", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationOnEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
