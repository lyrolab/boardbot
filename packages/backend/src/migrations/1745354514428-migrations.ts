import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1745354514428 implements MigrationInterface {
  name = "Migrations1745354514428"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "processingError" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "processingError"`)
  }
}
