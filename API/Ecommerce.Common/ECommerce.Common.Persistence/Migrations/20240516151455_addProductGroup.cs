using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addProductGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_User_CreatedById",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValue_Product_ProductId",
                table: "ProductAttributeValue");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValue_ProductId",
                table: "ProductAttributeValue");

            migrationBuilder.DropIndex(
                name: "IX_Product_CreatedById",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "OldPrice",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "PaybackCost",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "OverriddenPrice",
                table: "ProductAttributeCombination",
                newName: "Price");

            migrationBuilder.AlterColumn<int>(
                name: "StockQuantity",
                table: "ProductAttributeCombination",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "BarCode",
                table: "ProductAttributeCombination",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StockQuantity",
                table: "Product",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Product",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "BarCode",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BarCode",
                table: "ProductAttributeCombination");

            migrationBuilder.DropColumn(
                name: "BarCode",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "ProductAttributeCombination",
                newName: "OverriddenPrice");

            migrationBuilder.AlterColumn<int>(
                name: "StockQuantity",
                table: "ProductAttributeCombination",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StockQuantity",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OldPrice",
                table: "Product",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PaybackCost",
                table: "Product",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValue_ProductId",
                table: "ProductAttributeValue",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_CreatedById",
                table: "Product",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_User_CreatedById",
                table: "Product",
                column: "CreatedById",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValue_Product_ProductId",
                table: "ProductAttributeValue",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
