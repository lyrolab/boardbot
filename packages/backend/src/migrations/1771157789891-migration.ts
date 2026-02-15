import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1771157789891 implements MigrationInterface {
  name = "Migration1771157789891"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_tags_tag" ("postId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_e9b7b8e6a07bdccb6a954171676" PRIMARY KEY ("postId", "tagId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "post" RENAME COLUMN "providerStatus" TO "status"`,
    )
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "providerTags"`)
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_b651178cc41334544a7a9601c45" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_b651178cc41334544a7a9601c45"`,
    )
    await queryRunner.query(`ALTER TABLE "post" ADD "providerTags" jsonb`)
    await queryRunner.query(
      `ALTER TABLE "post" RENAME COLUMN "status" TO "providerStatus"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41e7626b9cc03c5c65812ae55e"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b651178cc41334544a7a9601c4"`,
    )
    await queryRunner.query(`DROP TABLE "post_tags_tag"`)
  }
}
