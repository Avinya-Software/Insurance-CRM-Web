using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class renewal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Renewals");

            migrationBuilder.DropTable(
                name: "PolicyTerms");

            migrationBuilder.CreateTable(
                name: "RenewalStatuses",
                columns: table => new
                {
                    RenewalStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RenewalStatuses", x => x.RenewalStatusId);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(77));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(79));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(79));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(80));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(81));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9870));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9871));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9873));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9874));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9875));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 715, DateTimeKind.Utc).AddTicks(9877));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(136));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(138));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(139));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(140));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(162));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(164));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(165));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(108));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(110));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(111));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 47, 56, 716, DateTimeKind.Utc).AddTicks(113));

            migrationBuilder.InsertData(
                table: "RenewalStatuses",
                columns: new[] { "RenewalStatusId", "IsActive", "StatusName" },
                values: new object[,]
                {
                    { 1, true, "Pending" },
                    { 2, true, "Renewed" },
                    { 3, true, "Lost" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RenewalStatuses_StatusName",
                table: "RenewalStatuses",
                column: "StatusName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RenewalStatuses");

            migrationBuilder.CreateTable(
                name: "PolicyTerms",
                columns: table => new
                {
                    PolicyTermId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyStatusId = table.Column<int>(type: "int", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsBackDated = table.Column<bool>(type: "bit", nullable: false),
                    LapseDays = table.Column<int>(type: "int", nullable: true),
                    PolicyDocumentRef = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PremiumGross = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PremiumNet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TermNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyTerms", x => x.PolicyTermId);
                    table.ForeignKey(
                        name: "FK_PolicyTerms_CustomerPolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "CustomerPolicies",
                        principalColumn: "PolicyId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PolicyTerms_PolicyStatuses_PolicyStatusId",
                        column: x => x.PolicyStatusId,
                        principalTable: "PolicyStatuses",
                        principalColumn: "PolicyStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PolicyTerms_PolicyTypes_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "PolicyTypes",
                        principalColumn: "PolicyTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Renewals",
                columns: table => new
                {
                    RenewalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyTermId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReminderLogJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReminderScheduleJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RenewalDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RenewalPremiumGross = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RenewalPremiumNet = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RenewalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Renewals", x => x.RenewalId);
                    table.ForeignKey(
                        name: "FK_Renewals_CustomerPolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "CustomerPolicies",
                        principalColumn: "PolicyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Renewals_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Renewals_PolicyTerms_PolicyTermId",
                        column: x => x.PolicyTermId,
                        principalTable: "PolicyTerms",
                        principalColumn: "PolicyTermId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6574));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6576));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6578));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6579));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6580));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6403));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6406));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6407));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6411));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6413));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6415));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6638));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6640));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6641));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6641));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6662));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6664));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6665));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6607));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6611));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6613));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 5, 33, 4, 663, DateTimeKind.Utc).AddTicks(6614));

            migrationBuilder.CreateIndex(
                name: "IX_PolicyTerms_PolicyId_PolicyStatusId",
                table: "PolicyTerms",
                columns: new[] { "PolicyId", "PolicyStatusId" },
                unique: true,
                filter: "[PolicyStatusId] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyTerms_PolicyStatusId",
                table: "PolicyTerms",
                column: "PolicyStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyTerms_PolicyTypeId",
                table: "PolicyTerms",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Renewals_CustomerId",
                table: "Renewals",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Renewals_PolicyId_RenewalStatus",
                table: "Renewals",
                columns: new[] { "PolicyId", "RenewalStatus" },
                unique: true,
                filter: "[RenewalStatus] = 'Pending'");

            migrationBuilder.CreateIndex(
                name: "IX_Renewals_PolicyTermId",
                table: "Renewals",
                column: "PolicyTermId");
        }
    }
}
