import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('devices')
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  deviceId: number;

  @Column()
  name: string;

  @ManyToMany(() => Room, (room) => room.devices)
  rooms: Room[];
}
