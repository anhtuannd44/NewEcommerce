using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserInfoDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "User",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "InitialName",
                table: "User",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "User",
                newName: "Address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "User",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "User",
                newName: "InitialName");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "User",
                newName: "FirstName");
        }
    }
}
