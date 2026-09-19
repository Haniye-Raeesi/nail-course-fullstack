using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Data;
using System.Security.Claims;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/enrollments")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EnrollmentsController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCourses()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var enrollments = await _context.Enrollments
            .Include(x => x.Course)
            .Where(x =>
                x.UserId == userId &&
                x.IsActive)
            .Select(x => new
            {
                x.Id,
                x.EnrolledAt,
                x.Progress,

                Course = new
                {
                    x.Course.Id,
                    x.Course.Title,
                    x.Course.Slug,
                    x.Course.ThumbnailUrl
                }
            })
            .ToListAsync();

        return Ok(enrollments);
    }

    [HttpGet("{courseId:guid}/access")]
    public async Task<IActionResult> CheckAccess(
        Guid courseId)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.CourseId == courseId &&
                x.IsActive);

        return Ok(new
        {
            hasAccess = enrollment != null,
            progress = enrollment?.Progress ?? 0
        });
    }
    #if DEBUG
    [HttpPost("dev/{courseId:guid}")]
    public async Task<IActionResult> CreateDevelopmentEnrollment(Guid courseId)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var course = await _context.Courses
            .FirstOrDefaultAsync(x =>
                x.Id == courseId &&
                x.IsPublished);

        if (course == null)
            return NotFound(new
            {
                message = "Course not found."
            });

        var existingEnrollment = await _context.Enrollments
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.CourseId == courseId);

        if (existingEnrollment != null)
        {
            if (!existingEnrollment.IsActive)
            {
                existingEnrollment.IsActive = true;
                existingEnrollment.Progress = 0;

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Enrollment activated.",
                enrollmentId = existingEnrollment.Id,
                courseId = course.Id
            });
        }

        var enrollment = new Enrollment
        {
            UserId = userId,
            CourseId = course.Id,
            EnrolledAt = DateTime.UtcNow,
            Progress = 0,
            IsActive = true
        };

        _context.Enrollments.Add(enrollment);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Development enrollment created.",
            enrollmentId = enrollment.Id,
            courseId = course.Id
        });
    }
#endif
}