using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadStatusTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeadStatuses",
                columns: table => new
                {
                    LeadStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadStatuses", x => x.LeadStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Leads",
                columns: table => new
                {
                    LeadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mobile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LeadStatusId = table.Column<int>(type: "int", nullable: false),
                    LeadSource = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdvisorId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsConverted = table.Column<bool>(type: "bit", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leads", x => x.LeadId);
                    table.ForeignKey(
                        name: "FK_Leads_LeadStatuses_LeadStatusId",
                        column: x => x.LeadStatusId,
                        principalTable: "LeadStatuses",
                        principalColumn: "LeadStatusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "LeadStatuses",
                columns: new[] { "LeadStatusId", "CreatedAt", "Description", "IsActive", "StatusName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1798), null, true, "New" },
                    { 2, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1803), null, true, "Contacted" },
                    { 3, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1807), null, true, "Qualified" },
                    { 4, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1810), null, true, "Follow Up" },
                    { 5, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1813), null, true, "Converted" },
                    { 6, new DateTime(2025, 12, 29, 6, 24, 34, 243, DateTimeKind.Utc).AddTicks(1816), null, true, "Lost" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Leads_LeadStatusId",
                table: "Leads",
                column: "LeadStatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Leads");

            migrationBuilder.DropTable(
                name: "LeadStatuses");
        }
    }
}
