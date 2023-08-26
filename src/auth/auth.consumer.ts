import { MailerService } from '@nest-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

@Processor('forgot-password')
export class SendMailConsumer {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  @Process()
  async forgotPassword(job: Job) {
    try {
      await this.mailerService.sendMail({
        to: job.data.email,
        subject: 'Thay đổi mật khẩu',
        text: `${this.configService.get(
          'DOMAIN_WEB',
        )}/auth/reset-password?token=${job.data.token}`,
      });
    } catch (error) {
      throw error;
    }
  }
}
