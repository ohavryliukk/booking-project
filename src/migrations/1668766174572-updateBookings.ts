import {MigrationInterface, QueryRunner} from "typeorm";

export class updateBookings1668766174572 implements MigrationInterface {
    name = 'updateBookings1668766174572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "recurringId"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "recurringId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "recurringId"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "recurringId" character varying`);
    }

}
