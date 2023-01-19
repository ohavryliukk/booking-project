import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  Column,
} from 'typeorm';
import { Booking } from './booking.entity';
import { User } from './user.entity';

@Entity('invitations')
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn()
  invitationId: number;

  @ManyToOne(() => Booking, (booking) => booking.invitations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId_FK' })
  bookingId: number;

  @Column('int', { nullable: true })
  invitedId_FK: number;
  @ManyToOne(() => User, (user) => user.invitations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitedId_FK' })
  userId: number;
}
