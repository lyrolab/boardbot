import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1744141745244 implements MigrationInterface {
  name = "Migrations1744141745244"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "board_context" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productDescription" text NOT NULL, "productGoals" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "REL_18aae82a24ad4cf2580debc1df" UNIQUE ("boardId"), CONSTRAINT "PK_317804e92caafe2cddadfa671b3" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "postCreatedAt" DROP DEFAULT`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_54f8ba2a04143c38d1ea54b79e" ON "post" ("postCreatedAt") `,
    )
    await queryRunner.query(
      `ALTER TABLE "board_context" ADD CONSTRAINT "FK_18aae82a24ad4cf2580debc1df1" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "board_context" DROP CONSTRAINT "FK_18aae82a24ad4cf2580debc1df1"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54f8ba2a04143c38d1ea54b79e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "postCreatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    )
    await queryRunner.query(`DROP TABLE "board_context"`)
  }
}
