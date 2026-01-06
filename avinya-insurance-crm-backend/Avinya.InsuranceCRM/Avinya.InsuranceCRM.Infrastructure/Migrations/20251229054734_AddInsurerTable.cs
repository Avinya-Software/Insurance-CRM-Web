using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Avinya.InsuranceCRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInsurerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Insurers",
                columns: table => new
                {
                    InsurerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InsurerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShortCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PortalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PortalUsername = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PortalPassword = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Insurers", x => x.InsurerId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Insurers");
        }
    }
}
