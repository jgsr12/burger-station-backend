import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is not defined');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendOrderConfirmation(email: string, subject: string, htmlContent: string) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL environment variable is not defined');
    }
    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Confirmación de Pedido - The Burger Station',
      html: htmlContent,
    };

    await sgMail.send(msg);
  }
}
