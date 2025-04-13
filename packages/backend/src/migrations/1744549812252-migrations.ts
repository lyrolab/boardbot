import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1744549812252 implements MigrationInterface {
  name = "Migrations1744549812252"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "appliedDecision" jsonb`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "appliedDecision"`)
  }
}
