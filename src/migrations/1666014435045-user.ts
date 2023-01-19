import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1666014435045 implements MigrationInterface {
  name = 'user1666014435045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'approved')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("userId" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "status" "public"."users_status_enum" DEFAULT 'pending', "role" "public"."users_role_enum" DEFAULT 'user', CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId")); COMMENT ON COLUMN "users"."userId" IS 'Auto inc'`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitations" ("invitationId" SERIAL NOT NULL, "bookingId_FK" integer, "invitedId_FK" integer, CONSTRAINT "PK_dd664c5309d45631faac5b70b1b" PRIMARY KEY ("invitationId")); COMMENT ON COLUMN "invitations"."invitedId_FK" IS 'Auto inc'`,
    );
    await queryRunner.query(
      `CREATE TABLE "offices" ("officeId" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_6a2f585862d12b608a657cad482" PRIMARY KEY ("officeId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("roomId" SERIAL NOT NULL, "name" character varying NOT NULL, "floor" integer NOT NULL, "capacity" integer NOT NULL, "office_FK" integer, CONSTRAINT "PK_31962cf242c2fdc6889493d9a99" PRIMARY KEY ("roomId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."schedules_days_enum" AS ENUM('monday', 'tuesday', 'wednessday', 'thursday', 'friday', 'saturday', 'sunday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedules" ("scheduleId" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "days" "public"."schedules_days_enum" NOT NULL, CONSTRAINT "PK_be0de31e8aee28fcfa49498969e" PRIMARY KEY ("scheduleId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("bookingId" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "startTime" TIMESTAMP, "endTime" TIMESTAMP, "duration" character varying, "user_FK" integer, "room_FK" integer, "schedule_FK" integer, CONSTRAINT "REL_0809395500cbb086ac63de686a" UNIQUE ("schedule_FK"), CONSTRAINT "PK_35a5c2c23622676b102ccc3b113" PRIMARY KEY ("bookingId")); COMMENT ON COLUMN "bookings"."user_FK" IS 'Auto inc'`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba" FOREIGN KEY ("bookingId_FK") REFERENCES "bookings"("bookingId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_3897c5634d728c6cc77296c0d46" FOREIGN KEY ("invitedId_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_724dd46651b400187f55c77e382" FOREIGN KEY ("office_FK") REFERENCES "offices"("officeId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_76921e017a1bff38d77a96f3fb3" FOREIGN KEY ("user_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_b7c766024ae856c7fcce79741b1" FOREIGN KEY ("room_FK") REFERENCES "rooms"("roomId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_0809395500cbb086ac63de686a5" FOREIGN KEY ("schedule_FK") REFERENCES "schedules"("scheduleId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_0809395500cbb086ac63de686a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_b7c766024ae856c7fcce79741b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_76921e017a1bff38d77a96f3fb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_724dd46651b400187f55c77e382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_3897c5634d728c6cc77296c0d46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TYPE "public"."schedules_days_enum"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "offices"`);
    await queryRunner.query(`DROP TABLE "invitations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
