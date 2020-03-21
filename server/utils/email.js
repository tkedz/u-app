const nodemailer = require('nodemailer');

class Email {
    static transport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    static async sendWelcome(email) {
        const options = {
            from: `Admin <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Witaj w UnlimitedApp',
            text: 'Cześć! Dzięki za rejestrację'
        };

        await Email.transport().sendMail(options);
    }

    static async sendPasswordReset(email, url) {
        const options = {
            from: `Admin <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Reset hasła',
            text: `Aby zresetować hasło udaj się tutaj: ${url}`
        };

        await Email.transport().sendMail(options);
    }
}

module.exports = Email;
