using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MobileNumber",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Advisors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7952));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7954));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7955));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7955));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7956));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7752));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7754));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7755));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7756));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7758));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7759));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8158));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8163));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8163));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8164));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8165));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8166));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8012));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8014));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8015));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8016));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8037));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8038));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(8039));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7983));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7985));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7986));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 7, 1, 25, 310, DateTimeKind.Utc).AddTicks(7988));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "MobileNumber",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Advisors");

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
    }
}
