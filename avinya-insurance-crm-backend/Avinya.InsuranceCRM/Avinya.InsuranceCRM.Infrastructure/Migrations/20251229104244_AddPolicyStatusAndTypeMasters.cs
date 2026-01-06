using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPolicyStatusAndTypeMasters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductCategories_ProductCategoryId",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "PolicyStatuses",
                columns: table => new
                {
                    PolicyStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyStatuses", x => x.PolicyStatusId);
                });

            migrationBuilder.CreateTable(
                name: "PolicyTypes",
                columns: table => new
                {
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyTypes", x => x.PolicyTypeId);
                });

            migrationBuilder.CreateTable(
                name: "CustomerPolicies",
                columns: table => new
                {
                    PolicyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InsurerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdvisorId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PolicyStatusId = table.Column<int>(type: "int", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    PolicyNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegistrationNo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PremiumNet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PremiumGross = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentDueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PolicyDocumentRef = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrokerCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PolicyCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPolicies", x => x.PolicyId);
                    table.ForeignKey(
                        name: "FK_CustomerPolicies_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerPolicies_Insurers_InsurerId",
                        column: x => x.InsurerId,
                        principalTable: "Insurers",
                        principalColumn: "InsurerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerPolicies_PolicyStatuses_PolicyStatusId",
                        column: x => x.PolicyStatusId,
                        principalTable: "PolicyStatuses",
                        principalColumn: "PolicyStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerPolicies_PolicyTypes_PolicyTypeId",
                        column: x => x.PolicyTypeId,
                        principalTable: "PolicyTypes",
                        principalColumn: "PolicyTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerPolicies_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.InsertData(
                table: "PolicyStatuses",
                columns: new[] { "PolicyStatusId", "CreatedAt", "IsActive", "StatusName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8787), true, "Active" },
                    { 2, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8793), true, "Lapsed" },
                    { 3, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8795), true, "Cancelled" },
                    { 4, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8797), true, "Pending" }
                });

            migrationBuilder.InsertData(
                table: "PolicyTypes",
                columns: new[] { "PolicyTypeId", "CreatedAt", "IsActive", "TypeName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8869), true, "Fresh" },
                    { 2, new DateTime(2025, 12, 29, 10, 42, 42, 796, DateTimeKind.Utc).AddTicks(8874), true, "Renewal" }
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPolicies_CustomerId",
                table: "CustomerPolicies",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPolicies_InsurerId",
                table: "CustomerPolicies",
                column: "InsurerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPolicies_PolicyStatusId",
                table: "CustomerPolicies",
                column: "PolicyStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPolicies_PolicyTypeId",
                table: "CustomerPolicies",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPolicies_ProductId",
                table: "CustomerPolicies",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductCategories_ProductCategoryId",
                table: "Products",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "ProductCategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductCategories_ProductCategoryId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "CustomerPolicies");

            migrationBuilder.DropTable(
                name: "PolicyStatuses");

            migrationBuilder.DropTable(
                name: "PolicyTypes");

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6075));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6077));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6078));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6079));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6079));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5915));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5918));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5919));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5920));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5921));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(5922));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6104));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6105));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6106));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6107));

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductCategories_ProductCategoryId",
                table: "Products",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "ProductCategoryId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
