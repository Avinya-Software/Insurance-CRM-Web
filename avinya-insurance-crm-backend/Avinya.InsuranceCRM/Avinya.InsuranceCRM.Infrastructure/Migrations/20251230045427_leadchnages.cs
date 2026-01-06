using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class leadchnages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3992));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3994));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3994));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3995));

            migrationBuilder.UpdateData(
                table: "LeadSources",
                keyColumn: "LeadSourceId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3996));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3807));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3809));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3810));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3812));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3813));

            migrationBuilder.UpdateData(
                table: "LeadStatuses",
                keyColumn: "LeadStatusId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(3814));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4049));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4051));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4052));

            migrationBuilder.UpdateData(
                table: "PolicyStatuses",
                keyColumn: "PolicyStatusId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4053));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4070));

            migrationBuilder.UpdateData(
                table: "PolicyTypes",
                keyColumn: "PolicyTypeId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4115));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4022));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4024));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4025));

            migrationBuilder.UpdateData(
                table: "ProductCategories",
                keyColumn: "ProductCategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 30, 4, 54, 25, 239, DateTimeKind.Utc).AddTicks(4027));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Leads");

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
        }
    }
}
