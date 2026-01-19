using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "SystemEvents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Renewals",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Leads",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Insurers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Customers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "CustomerPolicies",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Claims",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Campaigns",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Advisors",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyId);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4180));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4182));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4184));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4186));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3923));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3925));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3927));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3929));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3930));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(3932));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4538));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4540));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4541));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4542));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4543));

            migrationBuilder.UpdateData(
                table: "MasterCampaignTypes",
                keyColumn: "CampaignTypeId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4544));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4262));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4265));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4266));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4267));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4360));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4362));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4363));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4226));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4228));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4230));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 15, 11, 11, 5, 743, DateTimeKind.Utc).AddTicks(4232));

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_CompanyId",
                table: "AspNetUsers",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Company_CompanyId",
                table: "AspNetUsers",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "CompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Company_CompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_CompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "SystemEvents");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Renewals");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Insurers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "CustomerPolicies");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Advisors");

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
    }
}
