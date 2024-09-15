import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter; // nodemailler

  constructor(
      private configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'naver',
      auth: {
        user: configService.get('NAVER_USER'),
        pass: configService.get('NAVER_PASS'),
      },
    });
  }

  async sendVerificationToEmail(email: string, code: string) {
    const emailOptions: EmailOptions = {
      from: this.configService.get('NAVER_USER'),
      to: email,
      subject: 'Test Verification Code',
      html: `<p>Your verification code is: <b>${code}</b></p>`,
    };

    return await this.transporter.sendMail(emailOptions);
  }
}
