using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Data;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonProgressController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LessonProgressController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{lessonId:guid}")]
    public async Task<IActionResult> GetProgress(Guid lessonId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var lessonExists = await _context.Lessons
            .AsNoTracking()
            .AnyAsync(x => x.Id == lessonId);

        if (!lessonExists)
            return NotFound(new { message = "Lesson not found." });

        var progress = await _context.LessonProgresses
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.LessonId == lessonId &&
                x.UserId == userId);

        if (progress == null)
        {
            return Ok(new
            {
                lessonId,
                watchedSeconds = 0d,
                durationSeconds = 0d,
                lastPositionSeconds = 0d,
                progressPercent = 0d
            });
        }

        return Ok(new
        {
            lessonId = progress.LessonId,
            watchedSeconds = progress.WatchedSeconds,
            durationSeconds = progress.DurationSeconds,
            lastPositionSeconds = progress.LastPositionSeconds,
            progressPercent = progress.ProgressPercent
        });
    }

    [HttpPut("{lessonId:guid}")]
    public async Task<IActionResult> UpdateProgress(
        Guid lessonId,
        [FromBody] UpdateLessonProgressRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var lesson = await _context.Lessons
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == lessonId);

        if (lesson == null)
            return NotFound(new { message = "Lesson not found." });

        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(x =>
                x.CourseId == lesson.CourseId &&
                x.UserId == userId);

        if (!lesson.IsFree && enrollment == null)
            return Forbid();

        var durationSeconds = Math.Max(request.DurationSeconds, 0d);
        var watchedSeconds = Math.Max(request.WatchedSeconds, 0d);
        var lastPositionSeconds = Math.Max(request.LastPositionSeconds, 0d);

        if (durationSeconds > 0)
        {
            watchedSeconds = Math.Min(
                watchedSeconds,
                durationSeconds
            );

            lastPositionSeconds = Math.Min(
                lastPositionSeconds,
                durationSeconds
            );
        }

        double progressPercent = 0d;

        if (durationSeconds > 0)
        {
            progressPercent = Math.Round(
                (watchedSeconds / durationSeconds) * 100d,
                2
            );

            progressPercent = Math.Min(
                Math.Max(progressPercent, 0d),
                100d
            );
        }

        var progress = await _context.LessonProgresses
            .FirstOrDefaultAsync(x =>
                x.LessonId == lessonId &&
                x.UserId == userId);

        if (progress == null)
        {
            progress = new LessonProgress
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                UserId = userId,
                WatchedSeconds = watchedSeconds,
                DurationSeconds = durationSeconds,
                LastPositionSeconds = lastPositionSeconds,
                ProgressPercent = progressPercent
            };

            _context.LessonProgresses.Add(progress);
        }
        else
        {
            progress.WatchedSeconds = Math.Max(
                progress.WatchedSeconds,
                watchedSeconds
            );

            progress.DurationSeconds = Math.Max(
                progress.DurationSeconds,
                durationSeconds
            );

            progress.LastPositionSeconds = lastPositionSeconds;

            if (progress.DurationSeconds > 0)
            {
                progress.ProgressPercent = Math.Round(
                    (progress.WatchedSeconds /
                     progress.DurationSeconds) * 100d,
                    2
                );

                progress.ProgressPercent = Math.Min(
                    Math.Max(progress.ProgressPercent, 0d),
                    100d
                );
            }
        }

        if (enrollment != null)
        {
            var courseLessons = await _context.Lessons
                .AsNoTracking()
                .Where(x => x.CourseId == lesson.CourseId)
                .Select(x => new
                {
                    x.Id,
                    x.DurationInMinutes
                })
                .ToListAsync();

            var lessonIds = courseLessons
                .Select(x => x.Id)
                .ToList();

            var allProgress = await _context.LessonProgresses
                .AsNoTracking()
                .Where(x =>
                    x.UserId == userId &&
                    lessonIds.Contains(x.LessonId))
                .ToListAsync();

            var totalDurationSeconds = courseLessons.Sum(
                x => x.DurationInMinutes * 60d
            );

            var watchedTotalSeconds = allProgress.Sum(
                x => Math.Min(
                    x.WatchedSeconds,
                    x.DurationSeconds > 0
                        ? x.DurationSeconds
                        : double.MaxValue
                )
            );

            var existingCurrentProgress = allProgress
                .FirstOrDefault(x => x.LessonId == lessonId);

            if (existingCurrentProgress == null)
            {
                watchedTotalSeconds += watchedSeconds;
            }
            else
            {
                var oldWatched = Math.Min(
                    existingCurrentProgress.WatchedSeconds,
                    existingCurrentProgress.DurationSeconds > 0
                        ? existingCurrentProgress.DurationSeconds
                        : double.MaxValue
                );

                var newWatched = Math.Min(
                    progress.WatchedSeconds,
                    progress.DurationSeconds > 0
                        ? progress.DurationSeconds
                        : double.MaxValue
                );

                watchedTotalSeconds += newWatched - oldWatched;
            }

          if (totalDurationSeconds > 0)
{
    var courseProgress = Math.Round(
        Math.Min(
            Math.Max(
                (watchedTotalSeconds / totalDurationSeconds) * 100d,
                0d
            ),
            100d
        ),
        2
    );

    enrollment.Progress = (decimal)courseProgress;
}
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            lessonId,
            watchedSeconds = progress.WatchedSeconds,
            durationSeconds = progress.DurationSeconds,
            lastPositionSeconds = progress.LastPositionSeconds,
            progressPercent = progress.ProgressPercent,
            courseProgress = enrollment?.Progress ?? 0
        });
    }
}

public class UpdateLessonProgressRequest
{
    public double WatchedSeconds { get; set; }

    public double DurationSeconds { get; set; }

    public double LastPositionSeconds { get; set; }
}