import { MigrationInterface, QueryRunner } from 'typeorm';

export class datez1667594252429 implements MigrationInterface {
  name = 'datez1667594252429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_724dd46651b400187f55c77e382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "office_FK" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_724dd46651b400187f55c77e382" FOREIGN KEY ("office_FK") REFERENCES "offices"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_724dd46651b400187f55c77e382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "office_FK" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_724dd46651b400187f55c77e382" FOREIGN KEY ("office_FK") REFERENCES "offices"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
