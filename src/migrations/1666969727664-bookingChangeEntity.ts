import {MigrationInterface, QueryRunner} from "typeorm";

export class bookingChangeEntity1666969727664 implements MigrationInterface {
    name = 'bookingChangeEntity1666969727664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_76921e017a1bff38d77a96f3fb3"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_0809395500cbb086ac63de686a5"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "user_FK"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "REL_0809395500cbb086ac63de686a"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "schedule_FK"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "startDateTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "endDateTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "isRecurring" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "creatorId_FK" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "bookings"."creatorId_FK" IS 'Auto inc'`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb" FOREIGN KEY ("creatorId_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb"`);
        await queryRunner.query(`COMMENT ON COLUMN "bookings"."creatorId_FK" IS 'Auto inc'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "creatorId_FK"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "isRecurring"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "schedule_FK" integer`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "REL_0809395500cbb086ac63de686a" UNIQUE ("schedule_FK")`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "user_FK" integer`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "endTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "startTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_0809395500cbb086ac63de686a5" FOREIGN KEY ("schedule_FK") REFERENCES "schedules"("scheduleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_76921e017a1bff38d77a96f3fb3" FOREIGN KEY ("user_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
