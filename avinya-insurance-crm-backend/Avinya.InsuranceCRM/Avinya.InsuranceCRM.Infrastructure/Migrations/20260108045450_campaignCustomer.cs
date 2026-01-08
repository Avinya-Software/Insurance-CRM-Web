using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class campaignCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ApplyToAllCustomers",
                table: "Campaigns",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "CampaignCustomers",
                columns: table => new
                {
                    CampaignCustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignCustomers", x => x.CampaignCustomerId);
                    table.ForeignKey(
                        name: "FK_CampaignCustomers_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "CampaignId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignCustomers_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2630));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2633));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2633));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2634));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2635));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2230));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2236));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2237));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2238));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2239));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2241));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2689));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2691));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2692));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2693));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2711));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2712));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2713));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2663));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2665));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2666));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 8, 4, 54, 49, 342, DateTimeKind.Utc).AddTicks(2667));

            migrationBuilder.CreateIndex(
                name: "IX_CampaignCustomers_CampaignId_CustomerId",
                table: "CampaignCustomers",
                columns: new[] { "CampaignId", "CustomerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CampaignCustomers_CustomerId",
                table: "CampaignCustomers",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignCustomers");

            migrationBuilder.DropColumn(
                name: "ApplyToAllCustomers",
                table: "Campaigns");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9146));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9147));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9148));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9149));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9150));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8960));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8966));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8967));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8969));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8970));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(8971));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9198));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9200));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9201));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9202));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9220));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9222));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9223));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9174));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9175));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9176));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 7, 17, 30, 288, DateTimeKind.Utc).AddTicks(9178));
        }
    }
}
