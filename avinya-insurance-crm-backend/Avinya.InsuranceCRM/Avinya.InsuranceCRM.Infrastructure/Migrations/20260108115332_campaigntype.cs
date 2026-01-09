using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class campaigntype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MasterCampaignTypes",
                columns: table => new
                {
                    CampaignTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterCampaignTypes", x => x.CampaignTypeId);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7238));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7241));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7242));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7242));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7243));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7041));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7044));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7045));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7046));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7047));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7048));

            migrationBuilder.InsertData(
                table: "MasterCampaignTypes",
                columns: new[] { "CampaignTypeId", "CreatedAt", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7445), true, "Promotional" },
                    { 2, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7446), true, "Birthday" },
                    { 3, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7447), true, "Policy Renewal" },
                    { 4, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7448), true, "Payment Reminder" },
                    { 5, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7449), true, "Policy Expiry" },
                    { 6, new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7450), true, "Custom" }
                });

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7303));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7305));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7306));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7307));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7329));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7330));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7331));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7278));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7279));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7281));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7282));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MasterCampaignTypes");

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
        }
    }
}
