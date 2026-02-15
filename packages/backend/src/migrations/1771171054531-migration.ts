import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1771171054531 implements MigrationInterface {
  name = "Migration1771171054531"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_user_board_userId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_user_board_boardId"`,
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_user_board_userId"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_user_board_boardId"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_3c1ebe36479ec7348ebed9fc2d" ON "user_board" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a08e6af137cd4049e8f2673623" ON "user_board" ("boardId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_3c1ebe36479ec7348ebed9fc2db" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_a08e6af137cd4049e8f2673623e" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_a08e6af137cd4049e8f2673623e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_3c1ebe36479ec7348ebed9fc2db"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a08e6af137cd4049e8f2673623"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c1ebe36479ec7348ebed9fc2d"`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_user_board_boardId" ON "user_board" ("boardId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_user_board_userId" ON "user_board" ("userId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_user_board_boardId" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_user_board_userId" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
