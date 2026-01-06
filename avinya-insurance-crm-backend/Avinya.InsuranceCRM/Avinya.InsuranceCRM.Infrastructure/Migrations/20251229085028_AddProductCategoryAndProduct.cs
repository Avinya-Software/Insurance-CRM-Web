using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCategoryAndProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadSource_LeadSourceId",
                table: "Leads");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LeadSource",
                table: "LeadSource");

            migrationBuilder.RenameTable(
                name: "LeadSource",
                newName: "LeadSources");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LeadSources",
                table: "LeadSources",
                column: "LeadSourceId");

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    ProductCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.ProductCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InsurerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductCategoryId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ProductCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DefaultReminderDays = table.Column<int>(type: "int", nullable: false),
                    CommissionRules = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_ProductCategories_ProductCategoryId",
                        column: x => x.ProductCategoryId,
                        principalTable: "ProductCategories",
                        principalColumn: "ProductCategoryId",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.InsertData(
                table: "ProductCategories",
                columns: new[] { "ProductCategoryId", "CategoryName", "CreatedAt", "IsActive" },
                values: new object[,]
                {
                    { 1, "Term", new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6104), true },
                    { 2, "Health", new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6105), true },
                    { 3, "Motor", new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6106), true },
                    { 4, "Fire", new DateTime(2025, 12, 29, 8, 50, 26, 642, DateTimeKind.Utc).AddTicks(6107), true }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategories_CategoryName",
                table: "ProductCategories",
                column: "CategoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCategoryId",
                table: "Products",
                column: "ProductCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCode",
                table: "Products",
                column: "ProductCode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadSources_LeadSourceId",
                table: "Leads",
                column: "LeadSourceId",
                principalTable: "LeadSources",
                principalColumn: "LeadSourceId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadSources_LeadSourceId",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LeadSources",
                table: "LeadSources");

            migrationBuilder.RenameTable(
                name: "LeadSources",
                newName: "LeadSource");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LeadSource",
                table: "LeadSource",
                column: "LeadSourceId");

            migrationBuilder.UpdateData(
                table: "LeadSource",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3306));

            migrationBuilder.UpdateData(
                table: "LeadSource",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3309));

            migrationBuilder.UpdateData(
                table: "LeadSource",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3311));

            migrationBuilder.UpdateData(
                table: "LeadSource",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3313));

            migrationBuilder.UpdateData(
                table: "LeadSource",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 29, 6, 54, 53, 157, DateTimeKind.Utc).AddTicks(3315));

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

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadSource_LeadSourceId",
                table: "Leads",
                column: "LeadSourceId",
                principalTable: "LeadSource",
                principalColumn: "LeadSourceId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
