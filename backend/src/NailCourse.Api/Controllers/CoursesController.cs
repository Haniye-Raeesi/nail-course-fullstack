using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.DTOs;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Data;
using NailCourse.Infrastructure.Identity;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public CoursesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
[HttpGet]
public async Task<IActionResult> GetCourses()
{
    var courses = await _context.Courses
        .AsNoTracking()
        .Where(x => x.IsPublished)
        .Include(x => x.Category)
        .Include(x => x.Lessons)
        .OrderByDescending(x => x.CreatedAt)
        .Select(x => new
        {
            x.Id,
            x.Title,
            x.Slug,
            x.Description,
            x.Price,
            x.ThumbnailUrl,
            x.IsPublished,

            Category = new
            {
                x.Category.Id,
                x.Category.Name,
                x.Category.Slug
            },

            LessonsCount = x.Lessons.Count,

            DurationInMinutes = x.Lessons
                .Sum(l => l.DurationInMinutes)
        })
        .ToListAsync();

    return Ok(courses);
}

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await _context.Courses
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Lessons)
            .Where(x => x.Id == id && x.IsPublished)
            .Select(x => new
            {
                x.Id, x.Title, x.Slug, x.Description, x.Price, x.ThumbnailUrl, x.IsPublished,
                Category = new { x.Category.Id, x.Category.Name, x.Category.Slug },
                Lessons = x.Lessons.OrderBy(l => l.Order).Select(l => new
                {
                    l.Id, l.Title, l.Description, l.Order, l.DurationInMinutes, l.IsFree
                })
            })
            .FirstOrDefaultAsync();

        if (course == null) return NotFound(new { message = "Course not found." });
        return Ok(course);
    }
[HttpGet("{id:guid}/access")]
[Authorize]
public async Task<IActionResult> GetCourseAccess(Guid id)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (userId == null)
        return Unauthorized();

    var courseExists = await _context.Courses
        .AnyAsync(x => x.Id == id && x.IsPublished);

    if (!courseExists)
        return NotFound(new { message = "Course not found." });

    var enrollment = await _context.Enrollments
        .AsNoTracking()
        .FirstOrDefaultAsync(x =>
            x.CourseId == id &&
            x.UserId == userId);

    if (enrollment == null)
    {
        return Ok(new
        {
            CourseId = id,
            IsEnrolled = false,
            CanAccessPaidLessons = false,
            Progress = 0
        });
    }

    return Ok(new
    {
        CourseId = id,
        IsEnrolled = true,
        CanAccessPaidLessons = true,
        Progress = enrollment.Progress
    });
}


    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> CreateCourse(CreateCourseDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (!await _context.Categories.AnyAsync(x => x.Id == dto.CategoryId))
            return BadRequest(new { message = "Category not found." });

        if (await _context.Courses.AnyAsync(x => x.Slug == dto.Slug.Trim()))
            return Conflict(new { message = "Slug already exists." });

        var course = new Course
        {
            Id = Guid.NewGuid(), CategoryId = dto.CategoryId,
            TeacherId = User.IsInRole("Admin") ? userId : userId,
            Title = dto.Title.Trim(), Slug = dto.Slug.Trim(), Description = dto.Description?.Trim() ?? string.Empty,
            Price = dto.Price, ThumbnailUrl = dto.ThumbnailUrl, IsPublished = dto.IsPublished, CreatedAt = DateTime.UtcNow
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UpdateCourse(Guid id, UpdateCourseDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();
        if (!User.IsInRole("Admin") && course.TeacherId != userId) return Forbid();
        if (!await _context.Categories.AnyAsync(x => x.Id == dto.CategoryId)) return BadRequest(new { message = "Category not found." });
        if (await _context.Courses.AnyAsync(x => x.Id != id && x.Slug == dto.Slug.Trim())) return Conflict(new { message = "Slug already exists." });

        course.CategoryId = dto.CategoryId; course.Title = dto.Title.Trim(); course.Slug = dto.Slug.Trim();
        course.Description = dto.Description?.Trim() ?? string.Empty; course.Price = dto.Price;
        course.ThumbnailUrl = dto.ThumbnailUrl; course.IsPublished = dto.IsPublished; course.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(course);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();
        if (!User.IsInRole("Admin") && course.TeacherId != userId) return Forbid();

        // Keep course history and enrollments intact: delete is implemented as unpublish/archive.
        course.IsPublished = false;
        course.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
