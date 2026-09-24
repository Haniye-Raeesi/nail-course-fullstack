using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailCourse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSpotPlayerLicense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpotPlayerLicenses_Courses_CourseId",
                table: "SpotPlayerLicenses");

            migrationBuilder.AlterColumn<string>(
                name: "SpotPlayerLicenseId",
                table: "SpotPlayerLicenses",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Payload",
                table: "SpotPlayerLicenses",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LicenseUrl",
                table: "SpotPlayerLicenses",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "LicenseKey",
                table: "SpotPlayerLicenses",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_SpotPlayerLicenses_EnrollmentId",
                table: "SpotPlayerLicenses",
                column: "EnrollmentId",
                unique: true,
                filter: "[EnrollmentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SpotPlayerLicenses_SpotPlayerLicenseId",
                table: "SpotPlayerLicenses",
                column: "SpotPlayerLicenseId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SpotPlayerLicenses_Courses_CourseId",
                table: "SpotPlayerLicenses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SpotPlayerLicenses_Enrollments_EnrollmentId",
                table: "SpotPlayerLicenses",
                column: "EnrollmentId",
                principalTable: "Enrollments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpotPlayerLicenses_Courses_CourseId",
                table: "SpotPlayerLicenses");

            migrationBuilder.DropForeignKey(
                name: "FK_SpotPlayerLicenses_Enrollments_EnrollmentId",
                table: "SpotPlayerLicenses");

            migrationBuilder.DropIndex(
                name: "IX_SpotPlayerLicenses_EnrollmentId",
                table: "SpotPlayerLicenses");

            migrationBuilder.DropIndex(
                name: "IX_SpotPlayerLicenses_SpotPlayerLicenseId",
                table: "SpotPlayerLicenses");

            migrationBuilder.AlterColumn<string>(
                name: "SpotPlayerLicenseId",
                table: "SpotPlayerLicenses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Payload",
                table: "SpotPlayerLicenses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LicenseUrl",
                table: "SpotPlayerLicenses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "LicenseKey",
                table: "SpotPlayerLicenses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddForeignKey(
                name: "FK_SpotPlayerLicenses_Courses_CourseId",
                table: "SpotPlayerLicenses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
