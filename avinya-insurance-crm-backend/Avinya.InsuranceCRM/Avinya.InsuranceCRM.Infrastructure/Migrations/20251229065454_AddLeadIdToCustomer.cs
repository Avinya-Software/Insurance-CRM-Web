using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadIdToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LeadSource",
                table: "Leads",
                newName: "LeadNo");

            migrationBuilder.AddColumn<string>(
                name: "LeadSourceDescription",
                table: "Leads",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LeadSourceId",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "LeadId",
                table: "Customers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LeadSource",
                columns: table => new
                {
                    LeadSourceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SourceName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadSource", x => x.LeadSourceId);
                });

            migrationBuilder.InsertData(
                table: "LeadSource",
                columns: new[] { "LeadSourceId", "CreatedAt", "Description", "DisplayOrder", "IsActive", "SourceName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3306), null, 0, true, "Website" },
                    { 2, new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3309), null, 0, true, "Referral" },
                    { 3, new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3311), null, 0, true, "Agent" },
                    { 4, new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3313), null, 0, true, "Campaign" },
                    { 5, new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3315), null, 0, true, "Other" }
                });

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2878));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2882));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2886));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2889));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2892));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(2895));

            migrationBuilder.CreateIndex(
                name: "IX_Leads_LeadSourceId",
                table: "Leads",
                column: "LeadSourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadSource_LeadSourceId",
                table: "Leads",
                column: "LeadSourceId",
                principalTable: "LeadSource",
                principalColumn: "LeadSourceId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadSource_LeadSourceId",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "LeadSource");

            migrationBuilder.DropIndex(
                name: "IX_Leads_LeadSourceId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "LeadSourceDescription",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "LeadSourceId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "LeadId",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "LeadNo",
                table: "Leads",
                newName: "LeadSource");

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1798));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1803));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1807));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1810));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1813));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1816));
        }
    }
}
