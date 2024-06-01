using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addManageStockQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ManageStockQuantity",
                table: "Product",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManageStockQuantity",
                table: "Product");
        }
    }
}
