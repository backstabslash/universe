import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/utils';

class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly mailServiceLogin: string;
    private readonly mailServicePassword: string;

    constructor() {
        this.mailServiceLogin = getEnvVar("EMAIL_SERVICE_LOGIN")
        this.mailServicePassword = getEnvVar("EMAIL_SERVICE_PASS")
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.mailServiceLogin,
                pass: this.mailServicePassword
            }
        });
    }

    // Функция для генерации уникального кода
    generateConfirmationCode(length = 6) {
        const characters = '0123456789';
        let code = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        return code;
    }


    // Функция для отправки письма с кодом подтверждения
    sendConfirmationEmail(recipient: string, confirmationCode: string): void {
        const mailOptions = {
            from: this.mailServiceLogin,
            to: recipient,
            subject: 'Confirmation Code',
            text: `Your confirmation code is: ${confirmationCode}`
        };

        // this.transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });
    }
}

export default EmailService;
