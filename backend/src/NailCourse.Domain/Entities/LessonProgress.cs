namespace NailCourse.Domain.Entities;

public class LessonProgress
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public Guid LessonId { get; set; }

    public double WatchedSeconds { get; set; }

    public double DurationSeconds { get; set; }

    public double ProgressPercent { get; set; }

    public double LastPositionSeconds { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Lesson Lesson { get; set; } = null!;
}