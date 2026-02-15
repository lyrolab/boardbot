import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1771111050790 implements MigrationInterface {
  name = "Migration1771111050790"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "board" ADD "autoTriggerModeration" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "board" ADD "autoApplyDecision" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "board" DROP COLUMN "autoApplyDecision"`,
    )
    await queryRunner.query(
      `ALTER TABLE "board" DROP COLUMN "autoTriggerModeration"`,
    )
  }
}
