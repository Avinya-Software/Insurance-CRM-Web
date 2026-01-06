using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPolicyTermAndRenewal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PolicyTerms",
                columns: table => new
                {
                    PolicyTermId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TermNumber = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    PolicyStatusId = table.Column<int>(type: "int", nullable: false),
                    PremiumNet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PremiumGross = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsBackDated = table.Column<bool>(type: "bit", nullable: false),
                    LapseDays = table.Column<int>(type: "int", nullable: true),
                    PolicyDocumentRef = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PolicyTermId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    RenewalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RenewalDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RenewalPremiumNet = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RenewalPremiumGross = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ReminderScheduleJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReminderLogJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4447));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4450));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4451));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4451));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4452));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4164));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4166));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4168));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4169));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4170));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4172));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4510));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4513));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4514));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4518));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4540));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4542));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4543));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4483));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4485));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4486));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 4, 27, 14, 139, DateTimeKind.Utc).AddTicks(4488));

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Renewals");

            migrationBuilder.DropTable(
                name: "PolicyTerms");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7538));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7540));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7541));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7542));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7543));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7331));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7333));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7335));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7337));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7338));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7340));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7601));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7603));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7604));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7605));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7624));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7626));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7627));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7572));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7574));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7576));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 5, 12, 32, 21, 489, DateTimeKind.Utc).AddTicks(7577));
        }
    }
}
