import nodemailer from "nodemailer";
import { emailService } from "../config/config";

class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly mailServiceLogin: string;
  private readonly mailServicePassword: string;

  constructor() {
    this.mailServiceLogin = emailService.login;
    this.mailServicePassword = emailService.pass;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.mailServiceLogin,
        pass: this.mailServicePassword,
      },
    });
  }

  generateConfirmationCode(length = 6) {
    const characters = "0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }

  sendConfirmationEmail(recipient: string, confirmationCode: string): void {
    const mailOptions = {
      from: this.mailServiceLogin,
      to: recipient,
      subject: "Confirmation Code",
      text: `Your confirmation code is: ${confirmationCode}`,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    });
  }
}

export default EmailService;
