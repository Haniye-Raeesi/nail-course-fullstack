using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Infrastructure.Data;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LearningController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LearningController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{courseSlug}/{lessonId:guid}")]
    public async Task<IActionResult> GetLearningPage(
        string courseSlug,
        Guid lessonId)
    {
        var course = await _context.Courses
            .AsNoTracking()
            .Include(x => x.Lessons)
            .FirstOrDefaultAsync(x =>
                x.Slug == courseSlug &&
                x.IsPublished);

        if (course == null)
        {
            return NotFound(new
            {
                message = "Course not found."
            });
        }

        var selectedLesson = course.Lessons
            .FirstOrDefault(x => x.Id == lessonId);

        if (selectedLesson == null)
        {
            return NotFound(new
            {
                message = "Lesson not found."
            });
        }

        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var isEnrolled = false;
        decimal courseProgress = 0;

        if (!string.IsNullOrWhiteSpace(userId))
        {
            var enrollment = await _context.Enrollments
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.CourseId == course.Id &&
                    x.UserId == userId);

            if (enrollment != null)
            {
                isEnrolled = true;
                courseProgress = enrollment.Progress;
            }
        }

        var lessonProgresses = new Dictionary<Guid, object>();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            var progressRows = await _context.LessonProgresses
                .AsNoTracking()
                .Where(x =>
                    x.UserId == userId &&
                    x.Lesson.CourseId == course.Id)
                .ToListAsync();

            lessonProgresses = progressRows.ToDictionary(
                x => x.LessonId,
                x => (object)new
                {
                    watchedSeconds = x.WatchedSeconds,
                    durationSeconds = x.DurationSeconds,
                    lastPositionSeconds = x.LastPositionSeconds,
                    progressPercent = x.ProgressPercent
                });
        }

        var lessons = course.Lessons
            .OrderBy(x => x.Order)
            .Select(x =>
            {
                var canAccess =
                    x.IsFree || isEnrolled;

                lessonProgresses.TryGetValue(
                    x.Id,
                    out var progress
                );

                return new
                {
                    id = x.Id,
                    title = x.Title,
                    description = x.Description,
                    order = x.Order,
                    durationInMinutes = x.DurationInMinutes,
                    isFree = x.IsFree,

                    // VideoId فقط در صورت دسترسی ارسال می‌شود.
                    videoId = canAccess
                        ? x.VideoId
                        : null,

                    isLocked = !canAccess,

                    progress
                };
            })
            .ToList();

        var selectedLessonAccess =
            selectedLesson.IsFree || isEnrolled;

        return Ok(new
        {
            course = new
            {
                id = course.Id,
                title = course.Title,
                slug = course.Slug,
                description = course.Description,
                thumbnailUrl = course.ThumbnailUrl
            },

            isEnrolled,

            canAccessPaidLessons = isEnrolled,

            progress = courseProgress,

            selectedLessonId = selectedLesson.Id,

            selectedLessonAccess,

            lessons
        });
    }
}