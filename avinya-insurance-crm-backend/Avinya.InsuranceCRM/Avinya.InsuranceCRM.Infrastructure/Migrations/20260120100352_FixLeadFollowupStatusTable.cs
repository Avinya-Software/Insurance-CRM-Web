using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixLeadFollowupStatusTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FollowUpDate",
                table: "LeadFollowUps");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NextFollowUpDate",
                table: "LeadFollowUps",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LeadFollowUps",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "LeadFollowUps",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LeadFollowupStatus",
                columns: table => new
                {
                    LeadFollowupStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadFollowupStatus", x => x.LeadFollowupStatusID);
                });

            migrationBuilder.InsertData(
                table: "LeadFollowupStatus",
                columns: new[] { "LeadFollowupStatusID", "StatusName" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "In Progress" },
                    { 3, "Completed" }
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8038));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8040));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8041));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8042));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8042));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7865));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7868));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7869));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7870));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7872));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(7873));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8342));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8343));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8344));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8345));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8346));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8347));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8101));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8102));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8103));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8104));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8123));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8124));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8125));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8073));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8074));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8076));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 10, 3, 50, 53, DateTimeKind.Utc).AddTicks(8077));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LeadFollowupStatus");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LeadFollowUps");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "LeadFollowUps");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NextFollowUpDate",
                table: "LeadFollowUps",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTime>(
                name: "FollowUpDate",
                table: "LeadFollowUps",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 16, 6, 31, 29, 707, DateTimeKind.Utc).AddTicks(4245));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4790));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4791));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4792));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4792));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4576));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4578));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4579));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4580));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4582));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4583));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5028));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5029));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5031));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5032));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5033));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(5034));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4852));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4854));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4855));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4856));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4880));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4882));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4883));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4824));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4825));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4827));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4828));
        }
    }
}
