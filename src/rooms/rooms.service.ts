import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import { getRoomQueryDto } from './dto/getRoomQuery.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async getRooms(query: getRoomQueryDto): Promise<Room[]> {
    const endDate = moment().add(query.soonestBookingsDays, 'days').toDate();
    const key = query.roomId ? 'roomId' : 'office_FK';
    const value = query.roomId || query.officeId;

    return this.roomRepository.find({
      where: (qb: SelectQueryBuilder<Room>) => {
        qb.where({
          [key]: value,
        })
          .andWhere('Room__bookings.endDateTime > current_timestamp')
          .andWhere('Room__bookings.endDateTime < :end', { end: endDate })
          .orderBy('Room__bookings.startDateTime');
      },
      relations: ['bookings', 'devices'],
    });
  }

  async getAllRoomsWithDevices(): Promise<Room[]> {
    const result = await this.roomRepository.find({
      relations: ['devices', 'office'],
    });
    return this.groupAndSort(result);
  }
  groupAndSort(arr: Room[]) {
    return arr.reduce((acc: any, curr: Room) => {
      if (acc[curr.floor]) {
        return {
          ...acc,
          [curr.floor]: [...acc[curr.floor], curr].sort(
            (a, b) => b.capacity - a.capacity,
          ),
        };
      }
      return { ...acc, [curr.floor]: [curr] };
    }, {});
  }
}
