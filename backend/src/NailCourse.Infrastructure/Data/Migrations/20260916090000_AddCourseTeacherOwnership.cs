using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailCourse.Infrastructure.Data.Migrations;

public partial class AddCourseTeacherOwnership : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "TeacherId",
            table: "Courses",
            type: "nvarchar(450)",
            maxLength: 450,
            nullable: true);

        migrationBuilder.CreateIndex(
            name: "IX_Courses_TeacherId",
            table: "Courses",
            column: "TeacherId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Courses_TeacherId",
            table: "Courses");

        migrationBuilder.DropColumn(
            name: "TeacherId",
            table: "Courses");
    }
}
