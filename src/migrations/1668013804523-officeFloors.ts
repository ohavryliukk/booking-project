import { MigrationInterface, QueryRunner } from 'typeorm';

export class officeFloors1668013804523 implements MigrationInterface {
  name = 'officeFloors1668013804523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offices" ADD "floors" integer NOT NULL DEFAULT -1`,
    );
    await queryRunner.query(
      `ALTER TABLE "offices" ALTER COLUMN "floors" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offices" DROP COLUMN "floors"`);
  }
}
