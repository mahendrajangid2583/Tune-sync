const nodemailer = require("nodemailer");

const sender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: 'Tune-Sync',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log(info);
        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = sender;  // Export the sender function directly
