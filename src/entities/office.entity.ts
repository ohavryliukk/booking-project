import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('offices')
export class Office extends BaseEntity {
  @PrimaryGeneratedColumn()
  officeId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  floors: number;

  @OneToMany(() => Room, (room) => room.office)
  rooms: Room[];
}
