import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Invitation } from './invitation.entity';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  bookingId: number;

  @Column({ nullable: true, type: 'int' })
  recurringId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: false, type: 'timestamp' })
  startDateTime: Date;

  @Column({ nullable: false, type: 'timestamp' })
  endDateTime: Date;

  @Column('boolean', { default: false })
  isRecurring: boolean;

  @Column('int', { nullable: true })
  creatorId_FK: number;
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'creatorId_FK' })
  creatorId: number;

  @OneToMany(() => Invitation, (invitation) => invitation.bookingId)
  invitations: Invitation[];

  @Column('int', { nullable: true })
  room_FK: number;
  @ManyToOne(() => Room, (room) => room.bookings, { eager: true })
  @JoinColumn({ name: 'room_FK' })
  roomId: number;

  @Column('simple-array', { nullable: true })
  daysOfWeek: number[];
}
