import {MigrationInterface, QueryRunner} from "typeorm";

export class days1669241310862 implements MigrationInterface {
    name = 'days1669241310862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "daysOfWeek" text`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3897c5634d728c6cc77296c0d46"`);
        await queryRunner.query(`COMMENT ON COLUMN "invitations"."invitedId_FK" IS NULL`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3897c5634d728c6cc77296c0d46" FOREIGN KEY ("invitedId_FK") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3897c5634d728c6cc77296c0d46"`);
        await queryRunner.query(`COMMENT ON COLUMN "invitations"."invitedId_FK" IS 'Auto inc'`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3897c5634d728c6cc77296c0d46" FOREIGN KEY ("invitedId_FK") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "daysOfWeek"`);
    }

}
