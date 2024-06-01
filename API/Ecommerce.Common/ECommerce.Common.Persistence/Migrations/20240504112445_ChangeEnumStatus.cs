using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeEnumStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "PICStaffId",
                table: "Order",
                newName: "PicStaffId");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "Order",
                newName: "PreTotal");

            migrationBuilder.RenameColumn(
                name: "OrderTypeId",
                table: "Order",
                newName: "OrderAttributeId");

            migrationBuilder.RenameColumn(
                name: "CustomerGuidId",
                table: "Order",
                newName: "CustomerId");

            migrationBuilder.RenameColumn(
                name: "CustomerAddress",
                table: "Order",
                newName: "DiscountNote");

            migrationBuilder.RenameIndex(
                name: "IX_Order_OrderTypeId",
                table: "Order",
                newName: "IX_Order_OrderAttributeId");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "User",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "BillingAddress",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddress",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderAttribute_OrderAttributeId",
                table: "Order",
                column: "OrderAttributeId",
                principalTable: "OrderAttribute",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderAttribute_OrderAttributeId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "BillingAddress",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeliveryAddress",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "PicStaffId",
                table: "Order",
                newName: "PICStaffId");

            migrationBuilder.RenameColumn(
                name: "PreTotal",
                table: "Order",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "OrderAttributeId",
                table: "Order",
                newName: "OrderTypeId");

            migrationBuilder.RenameColumn(
                name: "DiscountNote",
                table: "Order",
                newName: "CustomerAddress");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Order",
                newName: "CustomerGuidId");

            migrationBuilder.RenameIndex(
                name: "IX_Order_OrderAttributeId",
                table: "Order",
                newName: "IX_Order_OrderTypeId");

            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "User",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order",
                column: "OrderTypeId",
                principalTable: "OrderAttribute",
                principalColumn: "Id");
        }
    }
}
