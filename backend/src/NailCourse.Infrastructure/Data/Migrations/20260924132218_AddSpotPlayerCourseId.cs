using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailCourse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSpotPlayerCourseId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpotPlayerCourseId",
                table: "Courses",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpotPlayerCourseId",
                table: "Courses");
        }
    }
}
