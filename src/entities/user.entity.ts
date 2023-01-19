import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Invitation } from './invitation.entity';

export enum Roles {
  user = 'user',
  admin = 'admin',
}

export enum Status {
  pending = 'pending',
  approved = 'approved',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Auto inc',
  })
  userId: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column('enum', { enum: Status, nullable: true, default: Status.pending })
  status: Status;

  @Column('enum', { enum: Roles, nullable: true, default: Roles.user })
  role: Roles;

  @OneToMany(() => Booking, (booking) => booking.creatorId)
  bookings: Booking[];

  @OneToMany(() => Invitation, (invitation) => invitation.userId)
  invitations: Invitation[];
}
