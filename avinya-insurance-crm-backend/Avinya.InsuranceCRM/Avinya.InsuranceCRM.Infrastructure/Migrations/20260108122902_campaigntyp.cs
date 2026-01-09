using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class campaigntyp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CampaignTypeId",
                table: "Campaigns",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(565));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(569));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(571));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(572));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(572));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(239));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(243));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(245));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(247));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(249));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(251));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(998));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(1004));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(1005));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(1007));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(1011));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(1012));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(678));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(680));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(681));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(682));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(719));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(722));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(723));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(621));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(624));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(626));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 12, 29, 0, 978, DateTimeKind.Utc).AddTicks(628));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CampaignTypeId",
                table: "Campaigns");

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

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7445));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7446));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7447));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7448));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7449));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 11, 53, 31, 457, DateTimeKind.Utc).AddTicks(7450));

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
    }
}
