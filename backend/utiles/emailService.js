import nodemailer from 'nodemailer'

export const sendWelcomeEmail = async (email, fullname, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
        const verificationLink = `http://localhost:8000/api/v1/user/verify-email/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `
        <h2>Hello ${fullname},</h2>
        <p>Click the link below to verify your email. This link will expire in 60 minutes:</p>
        <a href="${verificationLink}" target="_blank">Verify Email</a>
        <br/>
        <p>Best Regards,</p>
        <p>User Management</p>
    `,
};

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully")
    } catch (error) {
        console.log(error)
    }
}