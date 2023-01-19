import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MailModule } from './mail/mail.module';
import { RoomsModule } from './rooms/rooms.module';
import { OfficesModule } from './offices/offices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
      extra: {
        connectionLimit: 5,
      },
      url: process.env.DATABASE_URL, // only for heroku deploy
    }),
    UsersModule,
    BookingsModule,
    AuthModule,
    AdminModule,
    InvitationsModule,
    MailModule,
    RoomsModule,
    OfficesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
