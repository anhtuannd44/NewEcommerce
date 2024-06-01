using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addOrderOrigin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Deposit",
                table: "Order",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "OrderOriginId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrderOrigin",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newsequentialid()"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Version = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderOrigin", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_OrderOriginId",
                table: "Order",
                column: "OrderOriginId");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderOrigin_OrderOriginId",
                table: "Order",
                column: "OrderOriginId",
                principalTable: "OrderOrigin",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderOrigin_OrderOriginId",
                table: "Order");

            migrationBuilder.DropTable(
                name: "OrderOrigin");

            migrationBuilder.DropIndex(
                name: "IX_Order_OrderOriginId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Deposit",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "OrderOriginId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Order");
        }
    }
}
