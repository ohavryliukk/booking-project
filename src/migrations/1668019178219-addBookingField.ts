import {MigrationInterface, QueryRunner} from "typeorm";

export class addBookingField1668019178219 implements MigrationInterface {
    name = 'addBookingField1668019178219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "recurringId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "recurringId"`);
    }

}
