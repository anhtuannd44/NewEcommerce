using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Common.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCreatedForBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blog_User_AuthorId",
                table: "Blog");

            migrationBuilder.DropIndex(
                name: "IX_Blog_AuthorId",
                table: "Blog");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Blog");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_CreatedById",
                table: "Blog",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Blog_User_CreatedById",
                table: "Blog",
                column: "CreatedById",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blog_User_CreatedById",
                table: "Blog");

            migrationBuilder.DropIndex(
                name: "IX_Blog_CreatedById",
                table: "Blog");

            migrationBuilder.AddColumn<Guid>(
                name: "AuthorId",
                table: "Blog",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Blog_AuthorId",
                table: "Blog",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blog_User_AuthorId",
                table: "Blog",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
