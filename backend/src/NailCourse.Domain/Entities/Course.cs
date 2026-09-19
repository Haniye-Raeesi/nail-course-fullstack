namespace NailCourse.Domain.Entities;

public class Course
{
    public Guid Id { get; set; }

    public Guid CategoryId { get; set; }

    /// <summary>Identity user id of the teacher who owns this course. Admins may manage all courses.</summary>
    public string? TeacherId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string? ThumbnailUrl { get; set; }

    public bool IsPublished { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Category Category { get; set; } = null!;

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}