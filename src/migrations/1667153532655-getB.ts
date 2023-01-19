import {MigrationInterface, QueryRunner} from "typeorm";

export class getB1667153532655 implements MigrationInterface {
    name = 'getB1667153532655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "startDateTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "endDateTime" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "endDateTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "startDateTime" DROP NOT NULL`);
    }

}
