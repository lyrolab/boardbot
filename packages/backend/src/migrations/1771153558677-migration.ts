import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1771153558677 implements MigrationInterface {
  name = "Migration1771153558677"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "providerStatus" character varying`,
    )
    await queryRunner.query(`ALTER TABLE "post" ADD "providerTags" jsonb`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "providerTags"`)
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "providerStatus"`)
  }
}
