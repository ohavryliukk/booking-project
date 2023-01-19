import {MigrationInterface, QueryRunner} from "typeorm";

export class timestamp1667638772056 implements MigrationInterface {
    name = 'timestamp1667638772056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "startDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "endDateTime" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "endDateTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "startDateTime" character varying NOT NULL`);
    }

}
