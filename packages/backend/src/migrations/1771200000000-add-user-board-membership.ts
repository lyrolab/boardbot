import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserBoardMembership1771200000000 implements MigrationInterface {
  name = "AddUserBoardMembership1771200000000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app_user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "keycloakId" character varying NOT NULL,
        "email" character varying,
        "name" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_app_user_keycloakId" UNIQUE ("keycloakId"),
        CONSTRAINT "PK_app_user" PRIMARY KEY ("id")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE "user_board" (
        "userId" uuid NOT NULL,
        "boardId" uuid NOT NULL,
        CONSTRAINT "PK_user_board" PRIMARY KEY ("userId", "boardId")
      )`,
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_user_board_userId" ON "user_board" ("userId")`,
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_user_board_boardId" ON "user_board" ("boardId")`,
    )

    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_user_board_userId"
       FOREIGN KEY ("userId") REFERENCES "app_user"("id")
       ON DELETE CASCADE ON UPDATE CASCADE`,
    )

    await queryRunner.query(
      `ALTER TABLE "user_board" ADD CONSTRAINT "FK_user_board_boardId"
       FOREIGN KEY ("boardId") REFERENCES "board"("id")
       ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_user_board_boardId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_board" DROP CONSTRAINT "FK_user_board_userId"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_user_board_boardId"`)
    await queryRunner.query(`DROP INDEX "IDX_user_board_userId"`)
    await queryRunner.query(`DROP TABLE "user_board"`)
    await queryRunner.query(`DROP TABLE "app_user"`)
  }
}
