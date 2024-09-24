#nullable disable

using Microsoft.EntityFrameworkCore.Migrations;

namespace ECommerce.Notification.Api.Migrations.NotificationDb
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArchivedEmailMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    From = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CCs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BCCs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    MaxAttemptCount = table.Column<int>(type: "int", nullable: false),
                    NextAttemptDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ExpiredDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Log = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SentDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CopyFromId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchivedEmailMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ArchivedSmsMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    MaxAttemptCount = table.Column<int>(type: "int", nullable: false),
                    NextAttemptDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ExpiredDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Log = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SentDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CopyFromId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchivedSmsMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newsequentialid()"),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    From = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CCs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BCCs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    MaxAttemptCount = table.Column<int>(type: "int", nullable: false),
                    NextAttemptDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ExpiredDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Log = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SentDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CopyFromId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SmsMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newsequentialid()"),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    MaxAttemptCount = table.Column<int>(type: "int", nullable: false),
                    NextAttemptDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ExpiredDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Log = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SentDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CopyFromId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmsMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailMessageAttachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newsequentialid()"),
                    EmailMessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileEntryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailMessageAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailMessageAttachments_EmailMessages_EmailMessageId",
                        column: x => x.EmailMessageId,
                        principalTable: "EmailMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArchivedEmailMessages_CreatedDateTime",
                table: "ArchivedEmailMessages",
                column: "CreatedDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_ArchivedSmsMessages_CreatedDateTime",
                table: "ArchivedSmsMessages",
                column: "CreatedDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessageAttachments_EmailMessageId",
                table: "EmailMessageAttachments",
                column: "EmailMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessages_CreatedDateTime",
                table: "EmailMessages",
                column: "CreatedDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessages_SentDateTime",
                table: "EmailMessages",
                column: "SentDateTime")
                .Annotation("SqlServer:Include", new[] { "ExpiredDateTime", "AttemptCount", "MaxAttemptCount", "NextAttemptDateTime" });

            migrationBuilder.CreateIndex(
                name: "IX_SmsMessages_CreatedDateTime",
                table: "SmsMessages",
                column: "CreatedDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_SmsMessages_SentDateTime",
                table: "SmsMessages",
                column: "SentDateTime")
                .Annotation("SqlServer:Include", new[] { "ExpiredDateTime", "AttemptCount", "MaxAttemptCount", "NextAttemptDateTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArchivedEmailMessages");

            migrationBuilder.DropTable(
                name: "ArchivedSmsMessages");

            migrationBuilder.DropTable(
                name: "EmailMessageAttachments");

            migrationBuilder.DropTable(
                name: "SmsMessages");

            migrationBuilder.DropTable(
                name: "EmailMessages");
        }
    }
}
