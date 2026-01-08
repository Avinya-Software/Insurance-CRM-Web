using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class campaignRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CampaignRules_CampaignId",
                table: "CampaignRules");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "CampaignRules",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "CampaignRules",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "CampaignRules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3058));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3061));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3061));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3062));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3063));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2881));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2883));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2885));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2886));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2887));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(2888));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3121));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3123));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3124));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3125));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3145));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3146));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3147));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3091));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3093));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3094));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 9, 10, 24, 965, DateTimeKind.Utc).AddTicks(3096));

            migrationBuilder.CreateIndex(
                name: "IX_CampaignRules_CampaignId_IsActive",
                table: "CampaignRules",
                columns: new[] { "CampaignId", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CampaignRules_CampaignId_IsActive",
                table: "CampaignRules");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "CampaignRules");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "CampaignRules");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "CampaignRules");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6507));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6510));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6511));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6512));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6513));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6314));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6317));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6318));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6319));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6321));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6322));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6569));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6571));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6572));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6573));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6594));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6596));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6597));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6541));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6543));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6544));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 59, 43, 454, DateTimeKind.Utc).AddTicks(6546));

            migrationBuilder.CreateIndex(
                name: "IX_CampaignRules_CampaignId",
                table: "CampaignRules",
                column: "CampaignId");
        }
    }
}
