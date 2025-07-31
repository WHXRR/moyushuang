import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.qq.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER', ''),
        pass: this.configService.get<string>('EMAIL_PASS', ''),
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get<string>('EMAIL_FROM_NAME') || '魔域爽',
        address: this.configService.get<string>('EMAIL_USER') || '',
      },
      to,
      subject,
      html,
    });
  }
}
