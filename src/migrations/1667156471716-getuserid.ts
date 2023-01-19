import { MigrationInterface, QueryRunner } from 'typeorm';

export class getuserid1667156471716 implements MigrationInterface {
  name = 'getuserid1667156471716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "bookings"."creatorId_FK" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb" FOREIGN KEY ("creatorId_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "bookings"."creatorId_FK" IS 'Auto inc'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_38ca86d9e6b21e237ae09b3e4eb" FOREIGN KEY ("creatorId_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
