import {MigrationInterface, QueryRunner} from "typeorm";

export class device1667753572825 implements MigrationInterface {
    name = 'device1667753572825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("deviceId" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_666c9b59efda8ca85b29157152c" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`CREATE TABLE "rooms_devices_devices" ("roomsRoomId" integer NOT NULL, "devicesDeviceId" integer NOT NULL, CONSTRAINT "PK_f00b762456a1930383fd035ec8f" PRIMARY KEY ("roomsRoomId", "devicesDeviceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4791449276e505239f1e4d5dd5" ON "rooms_devices_devices" ("roomsRoomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fe1c1f5809deab649487a288d" ON "rooms_devices_devices" ("devicesDeviceId") `);
        await queryRunner.query(`ALTER TABLE "rooms_devices_devices" ADD CONSTRAINT "FK_4791449276e505239f1e4d5dd5d" FOREIGN KEY ("roomsRoomId") REFERENCES "rooms"("roomId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rooms_devices_devices" ADD CONSTRAINT "FK_5fe1c1f5809deab649487a288d5" FOREIGN KEY ("devicesDeviceId") REFERENCES "devices"("deviceId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms_devices_devices" DROP CONSTRAINT "FK_5fe1c1f5809deab649487a288d5"`);
        await queryRunner.query(`ALTER TABLE "rooms_devices_devices" DROP CONSTRAINT "FK_4791449276e505239f1e4d5dd5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fe1c1f5809deab649487a288d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4791449276e505239f1e4d5dd5"`);
        await queryRunner.query(`DROP TABLE "rooms_devices_devices"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
