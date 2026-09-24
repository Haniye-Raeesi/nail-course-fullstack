namespace NailCourse.Domain.Entities;

public class SpotPlayerLicense
{
    public Guid Id { get; set; }

    public Guid? OrderId { get; set; }

    public Guid? EnrollmentId { get; set; }

    public Guid CourseId { get; set; }

    public string SpotPlayerLicenseId { get; set; } = string.Empty;

    public string LicenseKey { get; set; } = string.Empty;

    public string LicenseUrl { get; set; } = string.Empty;

    public string? Payload { get; set; }

    public bool IsTest { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Course Course { get; set; } = null!;

    public Enrollment? Enrollment { get; set; }
}