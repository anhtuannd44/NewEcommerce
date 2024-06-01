using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddShippingFee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order");

            migrationBuilder.AlterColumn<Guid>(
                name: "OrderTypeId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<decimal>(
                name: "ShippingFee",
                table: "Order",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order",
                column: "OrderTypeId",
                principalTable: "OrderAttribute",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingFee",
                table: "Order");

            migrationBuilder.AlterColumn<Guid>(
                name: "OrderTypeId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderAttribute_OrderTypeId",
                table: "Order",
                column: "OrderTypeId",
                principalTable: "OrderAttribute",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
