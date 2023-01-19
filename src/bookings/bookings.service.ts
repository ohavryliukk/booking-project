import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Invitation } from 'src/entities/invitation.entity';
import {
  getConnection,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { BookingDto } from './dto/createBooking.dto';
import { RecurringBookingDto } from './dto/createRecurringBooking.dto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { UsersService } from 'src/users/users.service';
import { DatePeriodBookingsDto } from './dto/datePeriodBookingsdto';
import { UserBookingsDto } from './dto/userBookings.dto';
import { Room } from 'src/entities/room.entity';
import { Roles, User } from 'src/entities/user.entity';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { UpdateRecurringBookingDto } from './dto/updateRecurringBooking.dto';
import { MailService } from 'src/mail/mail.service';
import { isNumber } from 'class-validator';

const moment = extendMoment(Moment);

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Invitation)
    private inviteRepository: Repository<Invitation>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async addBooking(dto: BookingDto, id: number): Promise<Booking> {
    if (
      new Date(dto.startDateTime).getTime() >
      new Date(dto.endDateTime).getTime()
    ) {
      throw new HttpException(`Invalid date range`, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserById(id);
    const room = await this.roomRepository.findOne(dto.roomId);

    if (!user) {
      throw new HttpException(`User ID not found`, HttpStatus.FORBIDDEN);
    }

    if (!room) {
      throw new HttpException(`Room not found`, HttpStatus.BAD_REQUEST);
    }

    const existingBookings = await this.bookingRepository.find({
      where: [
        {
          room_FK: dto.roomId,
          startDateTime: LessThanOrEqual(dto.startDateTime),
          endDateTime: MoreThanOrEqual(dto.startDateTime),
        },
        {
          room_FK: dto.roomId,
          startDateTime: LessThanOrEqual(dto.endDateTime),
          endDateTime: MoreThanOrEqual(dto.endDateTime),
        },
      ],
    });

    if (existingBookings.length) {
      throw new HttpException(
        `Booking already exist for start time ${dto.startDateTime} and end time ${dto.endDateTime}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBooking = this.bookingRepository.create({
      title: dto.title,
      description: dto.description,
      room_FK: dto.roomId,
      startDateTime: dto.startDateTime,
      endDateTime: dto.endDateTime,
      creatorId_FK: user.userId,
    });
    await this.bookingRepository.save(newBooking);

    const invitations = [];

    if (dto.invitations.length) {
      const usersIds = [...dto.invitations];
      //usersIds.push(user.userId);

      if (dto.invitations.length) {
        for (const userId of usersIds) {
          const invitation = this.inviteRepository.create({
            bookingId: newBooking.bookingId,
            invitedId_FK: userId,
          });
          invitations.push(invitation);
        }
      }
      await this.inviteRepository.save(invitations);
      const users = await this.userRepository.findByIds(dto.invitations);
      await this.mailService.sendInviteEmail(users, [newBooking]);
    }

    return newBooking;
  }

  async addRecurringBooking(
    dto: RecurringBookingDto,
    id: number,
  ): Promise<Booking> {
    if (new Date(dto.startDate).getTime() > new Date(dto.endDate).getTime()) {
      throw new HttpException(`Invalid date range`, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserById(id);
    const room = await this.roomRepository.findOne(dto.roomId);

    if (!user) {
      throw new HttpException(`User ID not found`, HttpStatus.FORBIDDEN);
    }

    if (!room) {
      throw new HttpException(`Room not found`, HttpStatus.BAD_REQUEST);
    }

    const startDay = moment(dto.startDate, 'YYYY-MM-DD');
    const endDate = moment(dto.endDate, 'YYYY-MM-DD');

    const range = moment.range(startDay, endDate);

    const days = Array.from(range.by('days')).map((d) =>
      d.format('YYYY-MM-DD'),
    );
    if (!days.length) {
      throw new HttpException(`${range}`, HttpStatus.BAD_REQUEST);
    }
    if (days.length > 90) {
      throw new HttpException(
        `Maximum range: 90 days!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const bookings = [];
    const invitations = [];
    const usersIds = [...dto.invitations];
    //usersIds.push(user.userId);

    for (const day of days) {
      if (dto.daysOfWeek.includes(new Date(day).getDay())) {
        const existingBookings = await this.bookingRepository.find({
          where: [
            {
              room_FK: dto.roomId,
              startDateTime: LessThanOrEqual(`${day}T${dto.startTime}`),
              endDateTime: MoreThanOrEqual(`${day}T${dto.startTime}`),
            },
            {
              room_FK: dto.roomId,
              startDateTime: LessThanOrEqual(`${day}T${dto.endTime}`),
              endDateTime: MoreThanOrEqual(`${day}T${dto.endTime}`),
            },
          ],
        });

        if (existingBookings.length) {
          throw new HttpException(
            `Booking already exist for start time ${`${day}T${dto.startTime}`} and end time ${`${day}T${dto.endTime}`}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const booking = this.bookingRepository.create({
          title: dto.title,
          description: dto.description,
          startDateTime: `${day}T${dto.startTime}`,
          endDateTime: `${day}T${dto.endTime}`,
          isRecurring: true,
          creatorId_FK: id,
          room_FK: dto.roomId,
          daysOfWeek: dto.daysOfWeek,
        });

        bookings.push(booking);
      }
    }
    await this.bookingRepository.save(bookings);

    const uniqueId = bookings[0].bookingId;

    const newBookingsId = bookings.map((booking) => booking.bookingId);

    const bookingsWithRecurringId = await getConnection()
      .createQueryBuilder()
      .update(Booking)
      .set({
        recurringId: uniqueId,
      })
      .where({ bookingId: In(newBookingsId) })
      .returning('*')
      .execute();

    for (const oneBooking of bookingsWithRecurringId.raw) {
      for (const userId of usersIds) {
        const invitation = this.inviteRepository.create({
          bookingId: oneBooking.bookingId,
          invitedId_FK: userId,
        });
        invitations.push(invitation);
      }
    }
    await this.inviteRepository.save(invitations);
    const users = await this.userRepository.findByIds(dto.invitations);
    await this.mailService.sendInviteEmail(users, bookings);

    return bookingsWithRecurringId.raw;
  }

  async getBookingsByDate(
    roomId: string,
    startDate: string,
    endDate: string,
  ): Promise<DatePeriodBookingsDto> {
    let query;
    if (isNumber(Number(roomId))) {
      query = await this.bookingRepository
        .createQueryBuilder('bookings')
        .select([
          'bookings.bookingId',
          'bookings.title',
          'bookings.description',
          'bookings.startDateTime',
          'bookings.endDateTime',
          'bookings.isRecurring',
          'bookings.creatorId_FK',
          'bookings.room_FK',
          'bookings.daysOfWeek',
          'bookings.recurringId',
        ])
        .leftJoinAndSelect('bookings.invitations', 'invited')
        .where('bookings.startDateTime >= :start', { start: startDate })
        .andWhere('bookings.startDateTime <= :end', { end: endDate })
        .andWhere('bookings.room_FK = :room', { room: roomId })
        .getMany();
    } else if (roomId === '*') {
      query = await this.bookingRepository
        .createQueryBuilder('bookings')
        .select([
          'bookings.bookingId',
          'bookings.title',
          'bookings.description',
          'bookings.startDateTime',
          'bookings.endDateTime',
          'bookings.isRecurring',
          'bookings.creatorId_FK',
          'bookings.room_FK',
          'bookings.daysOfWeek',
          'bookings.recurringId',
        ])
        .leftJoinAndSelect('bookings.invitations', 'invited')
        .where('bookings.startDateTime >= :start', { start: startDate })
        .andWhere('bookings.startDateTime <= :end', { end: endDate })
        .orderBy('bookings.startDateTime')
        .getMany();
    } else
      throw new HttpException(
        'Query parameter is incorrect',
        HttpStatus.NOT_FOUND,
      );

    return {
      period: {
        startDate: startDate,
        endDate: endDate,
      },
      bookings: query,
    };
  }

  async getBookingsByUserId(
    id: number,
    page: number,
    limit: number,
  ): Promise<UserBookingsDto> {
    const query = await this.bookingRepository
      .createQueryBuilder('bookings')
      .select([
        'bookings.bookingId',
        'bookings.title',
        'bookings.description',
        'bookings.startDateTime',
        'bookings.endDateTime',
        'bookings.isRecurring',
        'bookings.creatorId_FK',
        'bookings.room_FK',
        'bookings.daysOfWeek',
      ])
      .leftJoinAndSelect('bookings.invitations', 'invited')
      .leftJoin(
        'invitations',
        'invitations',
        'invitations.bookingId_FK = bookings.bookingId',
      )
      .where('invitations.invitedId_FK = :id OR bookings.creatorId_FK = :id', {
        id: id,
      })
      .orderBy('bookings.startDateTime')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalCount = await this.bookingRepository
      .createQueryBuilder('bookings')
      .select([
        'bookings.bookingId',
        'bookings.title',
        'bookings.description',
        'bookings.startDateTime',
        'bookings.endDateTime',
        'bookings.isRecurring',
        'bookings.creatorId_FK',
        'bookings.room_FK',
        'bookings.daysOfWeek',
      ])
      .innerJoin(
        'invitations',
        'invitations',
        'invitations.bookingId_FK = bookings.bookingId',
      )
      .where('invitations.invitedId_FK = :id OR bookings.creatorId_FK = :id', {
        id: id,
      })
      .getCount();

    return {
      bookings: query,
      page: page,
      limit: limit,
      totalCount: totalCount,
    };
  }

  async getBookingById(id: number): Promise<Booking | null> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: id },
      relations: ['invitations', 'creatorId', 'roomId'],
    });
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    return booking;
  }

  async updateBookingById(dto: UpdateBookingDto, user: any): Promise<Booking> {
    if (!user) {
      throw new HttpException(`User ID not found`, HttpStatus.FORBIDDEN);
    }

    const booking = await this.getBookingById(dto.bookingId);

    if (!booking) {
      throw new HttpException(
        `Booking by this ID does not exist`,
        HttpStatus.FORBIDDEN,
      );
    }

    const existingBookings = await this.bookingRepository.find({
      where: [
        {
          bookingId: Not(dto.bookingId),
          room_FK: dto.roomId,
          startDateTime: LessThanOrEqual(dto.startDateTime),
          endDateTime: MoreThanOrEqual(dto.startDateTime),
        },
        {
          bookingId: Not(dto.bookingId),
          room_FK: dto.roomId,
          startDateTime: LessThanOrEqual(dto.endDateTime),
          endDateTime: MoreThanOrEqual(dto.endDateTime),
        },
      ],
    });

    if (existingBookings.length) {
      throw new HttpException(
        `Booking already exist for start time ${dto.startDateTime} and end time ${dto.endDateTime}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const query = this.bookingRepository
      .createQueryBuilder()
      .update()
      .set({
        title: dto.title,
        room_FK: dto.roomId,
        description: dto.description,
        startDateTime: dto.startDateTime,
        endDateTime: dto.endDateTime,
      })
      .where({
        bookingId: dto.bookingId,
      });

    if (user.role === Roles.user) {
      query.andWhere({
        creatorId_FK: user.id,
      });
    }

    const updatedBooking = await query.returning('*').execute();

    if (updatedBooking.affected === 0) {
      throw new HttpException(
        `You didn't create this booking`,
        HttpStatus.FORBIDDEN,
      );
    }

    this.inviteRepository
      .createQueryBuilder()
      .delete()
      .where({ bookingId: dto.bookingId })
      .execute();

    const invitations = [];
    const usersIds = [...dto.invitations];
    //usersIds.push(user.id);

    for (const userId of usersIds) {
      const invitation = this.inviteRepository.create({
        bookingId: dto.bookingId,
        invitedId_FK: userId,
      });
      invitations.push(invitation);
    }
    await this.inviteRepository.save(invitations);

    return updatedBooking.raw[0] as Booking;
  }

  async updateRecurringBooking(
    dto: UpdateRecurringBookingDto,
    user: any,
  ): Promise<Booking[]> {
    if (!user) {
      throw new HttpException('User ID not found', HttpStatus.FORBIDDEN);
    }

    const creator = await this.bookingRepository.findOne({
      where: { recurringId: dto.recurringId },
    });

    if (!creator) {
      throw new HttpException('Creator is not found', HttpStatus.FORBIDDEN);
    }

    await this.deleteReccuringBookingById(dto.recurringId, user);

    const startDay = moment(dto.startDate, 'YYYY-MM-DD');
    const endDate = moment(dto.endDate, 'YYYY-MM-DD');

    const range = moment.range(startDay, endDate);

    const days = Array.from(range.by('days')).map((d) =>
      d.format('YYYY-MM-DD'),
    );
    if (!days.length) {
      throw new HttpException(`${range}`, HttpStatus.BAD_REQUEST);
    }

    const bookings = [];
    const invitations = [];
    const usersIds = [...dto.invitations];
    //usersIds.push(user.id);

    for (const day of days) {
      if (dto.daysOfWeek.includes(new Date(day).getDay())) {
        const existingBookings = await this.bookingRepository.find({
          where: [
            {
              recurringId: Not(dto.recurringId),
              room_FK: dto.roomId,
              startDateTime: LessThanOrEqual(`${day}T${dto.startTime}`),
              endDateTime: MoreThanOrEqual(`${day}T${dto.startTime}`),
            },
            {
              recurringId: Not(dto.recurringId),
              room_FK: dto.roomId,
              startDateTime: LessThanOrEqual(`${day}T${dto.endTime}`),
              endDateTime: MoreThanOrEqual(`${day}T${dto.endTime}`),
            },
          ],
        });

        if (existingBookings.length) {
          throw new HttpException(
            `Booking already exist for start time ${`${day}T${dto.startTime}`} and end time ${`${day}T${dto.endTime}`}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const query = this.bookingRepository
          .createQueryBuilder()
          .insert()
          .values({
            recurringId: dto.recurringId,
            title: dto.title,
            description: dto.description,
            startDateTime: `${day}T${dto.startTime}`,
            endDateTime: `${day}T${dto.endTime}`,
            isRecurring: true,
            room_FK: dto.roomId,
            creatorId_FK: creator?.creatorId_FK,
          });
        const updatedBooking = await query.returning('*').execute();
        bookings.push(updatedBooking.raw[0]);
      }
    }

    for (const oneBooking of bookings) {
      for (const userId of usersIds) {
        const invitation = this.inviteRepository.create({
          bookingId: oneBooking.bookingId,
          invitedId_FK: userId,
        });
        invitations.push(invitation);
      }
    }
    await this.inviteRepository.save(invitations);

    return bookings;
  }

  async deleteBookingById(id: number, user: any): Promise<Booking> {
    if (!user) {
      throw new HttpException(`User ID not found`, HttpStatus.FORBIDDEN);
    }

    const booking = await this.getBookingById(id);

    if (!booking) {
      throw new HttpException(
        `Booking by this ID does not exist`,
        HttpStatus.FORBIDDEN,
      );
    }

    const query = this.bookingRepository
      .createQueryBuilder()
      .delete()
      .where({ bookingId: id });

    if (user.role === Roles.user) {
      query.andWhere({
        creatorId_FK: user.id,
      });
    }

    const updatedBooking = await query.returning('*').execute();

    if (updatedBooking.affected === 0) {
      throw new HttpException(
        `You didn't create this booking`,
        HttpStatus.FORBIDDEN,
      );
    }
    return updatedBooking.raw[0] as Booking;
  }

  async deleteReccuringBookingById(id: number, user: any): Promise<Booking> {
    if (!user) {
      throw new HttpException(`User ID not found`, HttpStatus.FORBIDDEN);
    }

    const booking = await this.getRecurringBooking(id);

    if (!booking) {
      throw new HttpException(
        `Booking by this ID does not exist`,
        HttpStatus.FORBIDDEN,
      );
    }

    const query = this.bookingRepository
      .createQueryBuilder()
      .delete()
      .where({ recurringId: id });

    if (user.role === Roles.user) {
      query.andWhere({
        creatorId_FK: user.id,
      });
    }

    const updatedBooking = await query.returning('*').execute();

    if (updatedBooking.affected === 0) {
      throw new HttpException(
        `You didn't create this booking`,
        HttpStatus.FORBIDDEN,
      );
    }
    return updatedBooking.raw as Booking;
  }

  async getRecurringBooking(id: number): Promise<boolean> {
    const booking = await this.bookingRepository.findOne({
      where: { recurringId: id },
    });

    if (!booking) {
      return false;
    } else return true;
  }
}
