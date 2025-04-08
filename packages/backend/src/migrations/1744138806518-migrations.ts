import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1744138806518 implements MigrationInterface {
  name = "Migrations1744138806518"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "postCreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "postCreatedAt"`)
  }
}
