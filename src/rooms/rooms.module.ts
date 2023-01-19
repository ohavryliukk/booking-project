import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from 'src/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, JwtService],
  imports: [TypeOrmModule.forFeature([Room])],
})
export class RoomsModule {}
