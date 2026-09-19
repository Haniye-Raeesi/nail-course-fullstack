namespace NailCourse.Application.DTOs;

public class CreateLessonDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Order { get; set; }

    public int DurationInMinutes { get; set; }

    public string? VideoId { get; set; }

    public bool IsFree { get; set; }
}