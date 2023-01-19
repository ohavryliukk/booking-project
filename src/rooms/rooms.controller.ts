import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuardPayload } from 'src/auth/auth.guard';
import { Room } from 'src/entities/room.entity';
import { getRoomQueryDto } from './dto/getRoomQuery.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuardPayload)
  @Get('info')
  async getRooms(@Query() query: getRoomQueryDto): Promise<Room[]> {
    return this.roomsService.getRooms(query);
  }

  @UseGuards(AuthGuardPayload)
  @Get()
  async getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRoomsWithDevices();
  }
}
