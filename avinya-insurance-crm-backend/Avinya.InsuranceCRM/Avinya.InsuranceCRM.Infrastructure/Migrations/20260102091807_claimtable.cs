using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class claimtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    ClaimId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IncidentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Documents = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CurrentStage = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TATDays = table.Column<int>(type: "int", nullable: false),
                    AssignedHandler = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Claims", x => x.ClaimId);
                    table.ForeignKey(
                        name: "FK_Claims_CustomerPolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "CustomerPolicies",
                        principalColumn: "PolicyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Claims_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4482));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4483));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4484));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4485));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4486));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4101));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4103));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4105));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4106));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4108));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4156));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4553));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4555));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4556));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4557));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4578));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4580));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4519));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4521));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4522));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 2, 9, 18, 5, 99, DateTimeKind.Utc).AddTicks(4524));

            migrationBuilder.CreateIndex(
                name: "IX_Claims_CustomerId",
                table: "Claims",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_PolicyId",
                table: "Claims",
                column: "PolicyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Claims");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3749));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3753));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3754));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3755));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3756));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3453));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3455));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3458));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3460));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3463));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3465));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3844));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3848));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3849));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3851));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3880));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3882));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3799));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3802));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3804));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 31, 4, 0, 52, 707, DateTimeKind.Utc).AddTicks(3807));
        }
    }
}
