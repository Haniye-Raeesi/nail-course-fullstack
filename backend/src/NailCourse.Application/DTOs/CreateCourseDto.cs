namespace NailCourse.Application.DTOs;

public class CreateCourseDto
{
    public Guid CategoryId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string? ThumbnailUrl { get; set; }

    public bool IsPublished { get; set; }
}