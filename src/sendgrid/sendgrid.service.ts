import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is not set');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text,
    };
    await sgMail.send(msg);
  }
}
