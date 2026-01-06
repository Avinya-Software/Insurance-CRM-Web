using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class claimMater : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedHandler",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "ClaimType",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "CurrentStage",
                table: "Claims");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Documents",
                table: "Claims",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddColumn<int>(
                name: "ClaimHandlerId",
                table: "Claims",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ClaimStageId",
                table: "Claims",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ClaimTypeId",
                table: "Claims",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ClaimHandlers",
                columns: table => new
                {
                    ClaimHandlerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HandlerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimHandlers", x => x.ClaimHandlerId);
                });

            migrationBuilder.CreateTable(
                name: "ClaimStages",
                columns: table => new
                {
                    ClaimStageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StageName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimStages", x => x.ClaimStageId);
                });

            migrationBuilder.CreateTable(
                name: "ClaimTypes",
                columns: table => new
                {
                    ClaimTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaimTypes", x => x.ClaimTypeId);
                });

            migrationBuilder.InsertData(
                table: "ClaimHandlers",
                columns: new[] { "ClaimHandlerId", "HandlerName", "IsActive" },
                values: new object[,]
                {
                    { 1, "Advisor", true },
                    { 2, "ClaimOfficer", true },
                    { 3, "Surveyor", true },
                    { 4, "Manager", true }
                });

            migrationBuilder.InsertData(
                table: "ClaimStages",
                columns: new[] { "ClaimStageId", "IsActive", "StageName" },
                values: new object[,]
                {
                    { 1, true, "Initiated" },
                    { 2, true, "DocumentsPending" },
                    { 3, true, "UnderReview" },
                    { 4, true, "Approved" },
                    { 5, true, "Rejected" },
                    { 6, true, "Settled" }
                });

            migrationBuilder.InsertData(
                table: "ClaimTypes",
                columns: new[] { "ClaimTypeId", "IsActive", "TypeName" },
                values: new object[,]
                {
                    { 1, true, "Accident" },
                    { 2, true, "Medical" },
                    { 3, true, "Death" },
                    { 4, true, "Theft" },
                    { 5, true, "Fire" },
                    { 6, true, "NaturalDisaster" }
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3584));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3587));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3588));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3589));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3590));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3263));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3265));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3266));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3268));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3269));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3273));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3719));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3720));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3721));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3722));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3743));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3744));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3682));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3684));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3686));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 10, 14, 47, 676, DateTimeKind.Utc).AddTicks(3688));

            migrationBuilder.CreateIndex(
                name: "IX_Claims_ClaimHandlerId",
                table: "Claims",
                column: "ClaimHandlerId");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_ClaimStageId",
                table: "Claims",
                column: "ClaimStageId");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_ClaimTypeId",
                table: "Claims",
                column: "ClaimTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_ClaimHandlers_ClaimHandlerId",
                table: "Claims",
                column: "ClaimHandlerId",
                principalTable: "ClaimHandlers",
                principalColumn: "ClaimHandlerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_ClaimStages_ClaimStageId",
                table: "Claims",
                column: "ClaimStageId",
                principalTable: "ClaimStages",
                principalColumn: "ClaimStageId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_ClaimTypes_ClaimTypeId",
                table: "Claims",
                column: "ClaimTypeId",
                principalTable: "ClaimTypes",
                principalColumn: "ClaimTypeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_ClaimHandlers_ClaimHandlerId",
                table: "Claims");

            migrationBuilder.DropForeignKey(
                name: "FK_Claims_ClaimStages_ClaimStageId",
                table: "Claims");

            migrationBuilder.DropForeignKey(
                name: "FK_Claims_ClaimTypes_ClaimTypeId",
                table: "Claims");

            migrationBuilder.DropTable(
                name: "ClaimHandlers");

            migrationBuilder.DropTable(
                name: "ClaimStages");

            migrationBuilder.DropTable(
                name: "ClaimTypes");

            migrationBuilder.DropIndex(
                name: "IX_Claims_ClaimHandlerId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_ClaimStageId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_ClaimTypeId",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "ClaimHandlerId",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "ClaimStageId",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "ClaimTypeId",
                table: "Claims");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Documents",
                table: "Claims",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignedHandler",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClaimType",
                table: "Claims",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentStage",
                table: "Claims",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4482));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4483));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4484));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4485));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4486));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4101));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4103));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4105));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4106));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4108));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4156));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4553));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4555));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4556));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4557));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4578));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4580));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4519));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4521));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4522));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4524));
        }
    }
}
