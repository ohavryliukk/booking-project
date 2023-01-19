import {MigrationInterface, QueryRunner} from "typeorm";

export class addInvitationOnDelete1668025233994 implements MigrationInterface {
    name = 'addInvitationOnDelete1668025233994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3897c5634d728c6cc77296c0d46"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba"`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba" FOREIGN KEY ("bookingId_FK") REFERENCES "bookings"("bookingId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3897c5634d728c6cc77296c0d46" FOREIGN KEY ("invitedId_FK") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_3897c5634d728c6cc77296c0d46"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba"`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_a3217ee8622cf7d751b04a366ba" FOREIGN KEY ("bookingId_FK") REFERENCES "bookings"("bookingId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_3897c5634d728c6cc77296c0d46" FOREIGN KEY ("invitedId_FK") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
