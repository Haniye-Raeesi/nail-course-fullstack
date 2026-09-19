namespace NailCourse.Application.DTOs;

public class CourseAccessDto
{
    public Guid CourseId { get; set; }
    public bool IsEnrolled { get; set; }
    public bool CanAccessPaidLessons { get; set; }
    public decimal Progress { get; set; }
}