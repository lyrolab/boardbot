import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1743700274805 implements MigrationInterface {
  name = "Migrations1743700274805"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fider_board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "baseUrl" character varying NOT NULL, "apiKey" character varying NOT NULL, "lastFetchedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "REL_afd60eb7691b012c0bf2671cb3" UNIQUE ("boardId"), CONSTRAINT "PK_b782b20ddf4341924cd725e3fbb" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "externalId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "externalId" character varying NOT NULL, "processingStatus" character varying NOT NULL DEFAULT 'pending', "decision" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "fider_board" ADD CONSTRAINT "FK_afd60eb7691b012c0bf2671cb3c" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_8b7e10700f2aaed6c31625451e4" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_73a3143e2efbdbab45872c47fd7" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_73a3143e2efbdbab45872c47fd7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "FK_8b7e10700f2aaed6c31625451e4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "fider_board" DROP CONSTRAINT "FK_afd60eb7691b012c0bf2671cb3c"`,
    )
    await queryRunner.query(`DROP TABLE "board"`)
    await queryRunner.query(`DROP TABLE "post"`)
    await queryRunner.query(`DROP TABLE "tag"`)
    await queryRunner.query(`DROP TABLE "fider_board"`)
  }
}
