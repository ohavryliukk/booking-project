import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Device } from './devices.entity';
import { Office } from './office.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  name: string;

  @Column()
  floor: number;

  @Column()
  capacity: number;

  @Column()
  office_FK: number;

  @ManyToOne(() => Office, (office) => office.rooms)
  @JoinColumn({ name: 'office_FK' })
  office: Office;

  @OneToMany(() => Booking, (booking) => booking.roomId)
  bookings: Booking[];

  @ManyToMany(() => Device, (device) => device.rooms)
  @JoinTable()
  devices: Device[]
}
