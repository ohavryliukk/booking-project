import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Booking } from 'src/entities/booking.entity';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(user: CreateUserDto) {
    const url = process.env.EMAIL_VERIFICATION_URL + `/email=${user.email}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Registration link',
      template: './verificationEmail',
      context: {
        url,
      },
    });
  }

  async sendPassResetEmail(email: string, password: string) {
    const newPassword = password;

    await this.mailerService.sendMail({
      to: email,
      subject: 'INCORA reset password!',
      template: './resetPassword',
      context: {
        newPassword,
      },
    });
  }

  async sendInviteEmail(users: User[], bookings: Booking[]) {
    const schedule: any[] = [];
    for (const booking of bookings) {
      schedule.push({
        start: booking.startDateTime,
        end: booking.endDateTime,
      });
    }
    const title = bookings[0].title;
    const scheduleStrind = schedule.map((i) => JSON.stringify(i)).toString();

    for (const user of users) {
      const userName = user.firstName;
      const email = user.email;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Invitation to a meeting!',
        template: './inviteUser',
        context: {
          title,
          scheduleStrind,
          userName,
        },
      });
    }
  }
}
