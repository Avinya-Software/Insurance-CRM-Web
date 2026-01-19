using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class c : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(770));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(772));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(772));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(773));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(774));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(597));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(599));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(600));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(601));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(603));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(604));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(992));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(997));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(998));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(999));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(1000));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(1001));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(839));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(843));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(844));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(845));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(868));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(871));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(872));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(801));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(802));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(804));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 10, 58, 15, 717, DateTimeKind.Utc).AddTicks(813));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 5, 43, 46, 490, DateTimeKind.Utc).AddTicks(4788));

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
