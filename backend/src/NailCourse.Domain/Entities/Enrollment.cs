namespace NailCourse.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Guid CourseId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public bool IsActive { get; set; } = true;
    public decimal Progress { get; set; }
    public Course Course { get; set; } = null!;
    public SpotPlayerLicense? SpotPlayerLicense { get; set; }
}