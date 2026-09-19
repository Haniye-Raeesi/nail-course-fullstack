namespace NailCourse.Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Order { get; set; }

    public int DurationInMinutes { get; set; }

    public string? VideoId { get; set; }

    public bool IsFree { get; set; }

    public DateTime CreatedAt { get; set; }

    public Course Course { get; set; } = null!;
}