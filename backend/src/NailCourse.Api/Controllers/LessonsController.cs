using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.DTOs;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/courses/{courseId:guid}/lessons")]
public class LessonsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LessonsController(ApplicationDbContext context)
    {
        _context = context;
    }

  [HttpGet]
public async Task<IActionResult> GetLessons(Guid courseId)
{
    var courseExists = await _context.Courses
        .AnyAsync(x => x.Id == courseId);

    if (!courseExists)
        return NotFound(new
        {
            message = "Course not found."
        });

    var userId = User.FindFirstValue(
        ClaimTypes.NameIdentifier);

    var hasEnrollment = userId != null &&
        await _context.Enrollments.AnyAsync(x =>
            x.UserId == userId &&
            x.CourseId == courseId &&
            x.IsActive);

    var lessons = await _context.Lessons
        .Where(x => x.CourseId == courseId)
        .OrderBy(x => x.Order)
        .Select(x => new
        {
            x.Id,
            x.Title,
            x.Description,
            x.Order,
            x.DurationInMinutes,
            x.IsFree,

            VideoId = x.IsFree || hasEnrollment
                ? x.VideoId
                : null
        })
        .ToListAsync();

    return Ok(lessons);
}

    [HttpGet("{lessonId:guid}")]
    public async Task<IActionResult> GetLesson(Guid courseId, Guid lessonId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var lesson = await _context.Lessons.FirstOrDefaultAsync(x => x.Id == lessonId && x.CourseId == courseId);
        if (lesson == null) return NotFound(new { message = "Lesson not found." });

        var hasAccess = lesson.IsFree || (userId != null && await _context.Enrollments.AnyAsync(x => x.UserId == userId && x.CourseId == courseId && x.IsActive));
        return Ok(new
        {
            lesson.Id, lesson.CourseId, lesson.Title, lesson.Description, lesson.Order, lesson.DurationInMinutes, lesson.IsFree,
            isLocked = !hasAccess,
            videoId = hasAccess ? lesson.VideoId : null
        });
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> CreateLesson(
        Guid courseId,
        CreateLessonDto dto)
    {
        var courseExists = await _context.Courses
            .AnyAsync(x => x.Id == courseId);

        if (!courseExists)
        {
            return NotFound(new
            {
                message = "Course not found."
            });
        }

        var lesson = new Lesson
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            Title = dto.Title,
            Description = dto.Description,
            Order = dto.Order,
            DurationInMinutes = dto.DurationInMinutes,
            VideoId = dto.VideoId,
            IsFree = dto.IsFree,
            CreatedAt = DateTime.UtcNow
        };

        _context.Lessons.Add(lesson);

        await _context.SaveChangesAsync();

        return Ok(lesson);
    }

    [HttpDelete("{lessonId:guid}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteLesson(
        Guid courseId,
        Guid lessonId)
    {
        var lesson = await _context.Lessons
            .FirstOrDefaultAsync(x =>
                x.Id == lessonId &&
                x.CourseId == courseId);

        if (lesson == null)
            return NotFound();

        _context.Lessons.Remove(lesson);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}