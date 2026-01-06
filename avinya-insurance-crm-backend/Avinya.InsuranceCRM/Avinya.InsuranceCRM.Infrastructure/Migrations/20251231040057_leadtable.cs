using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class leadtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
