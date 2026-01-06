using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadFollowUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeadFollowUps",
                columns: table => new
                {
                    FollowUpId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FollowUpDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NextFollowUpDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadFollowUps", x => x.FollowUpId);
                    table.ForeignKey(
                        name: "FK_LeadFollowUps_Leads_LeadId",
                        column: x => x.LeadId,
                        principalTable: "Leads",
                        principalColumn: "LeadId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2005));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2008));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2010));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2012));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2014));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1497));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1502));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1505));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1508));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1512));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(1515));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2172));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2177));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2179));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2181));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2235));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2239));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2096));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2101));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2104));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 11, 46, 49, 443, DateTimeKind.Utc).AddTicks(2108));

            migrationBuilder.CreateIndex(
                name: "IX_LeadFollowUps_LeadId",
                table: "LeadFollowUps",
                column: "LeadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LeadFollowUps");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8535));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8541));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8543));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8546));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8548));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7893));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7901));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7905));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7908));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7912));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(7916));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8787));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8793));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8795));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8797));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8869));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8874));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8681));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8686));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8689));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8692));
        }
    }
}
