using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Data;
using NailCourse.Infrastructure.Identity;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/teacher")]
[Authorize(Roles = "Teacher,Admin")]
public class TeacherController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TeacherController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    private string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);
    private bool IsAdmin => User.IsInRole("Admin");

    private IQueryable<Course> OwnedCourses()
    {
        var query = _context.Courses.AsQueryable();
        return IsAdmin ? query : query.Where(c => c.TeacherId == CurrentUserId);
    }

    private async Task<Course?> FindOwnedCourse(Guid courseId)
    {
        return await OwnedCourses().FirstOrDefaultAsync(c => c.Id == courseId);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var courses = OwnedCourses();
        var courseIds = courses.Select(x => x.Id);
        var paidPayments = _context.Payments
            .Where(x => x.IsSuccessful && x.Order.Items.Any(i => courseIds.Contains(i.CourseId)));

        var totalRevenue = await _context.OrderItems
            .Where(i => courseIds.Contains(i.CourseId) && i.Order.Status == NailCourse.Domain.Enums.OrderStatus.Paid)
            .SumAsync(i => (decimal?)i.Price) ?? 0;

        var activeStudents = await _context.Enrollments
            .Where(x => x.IsActive && courseIds.Contains(x.CourseId))
            .Select(x => x.UserId)
            .Distinct()
            .CountAsync();

        return Ok(new
        {
            courses = await courses.CountAsync(),
            publishedCourses = await courses.CountAsync(x => x.IsPublished),
            students = activeStudents,
            enrollments = await _context.Enrollments.CountAsync(x => x.IsActive && courseIds.Contains(x.CourseId)),
            paidOrders = await _context.Orders.CountAsync(x => x.Status == NailCourse.Domain.Enums.OrderStatus.Paid && x.Items.Any(i => courseIds.Contains(i.CourseId))),
            totalRevenue,
            successfulPayments = await paidPayments.CountAsync(),
            pendingPayments = await _context.Payments.CountAsync(x => !x.IsSuccessful && x.Order.Status == NailCourse.Domain.Enums.OrderStatus.Pending && x.Order.Items.Any(i => courseIds.Contains(i.CourseId)))
        });
    }

    [HttpGet("courses")]
    public async Task<IActionResult> Courses()
    {
        var owned = OwnedCourses();
        var courses = await owned
            .Include(x => x.Category)
            .Include(x => x.Lessons)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id, x.Title, x.Slug, x.Description, x.Price, x.ThumbnailUrl, x.IsPublished,
                x.CreatedAt, x.UpdatedAt, x.TeacherId,
                Category = new { x.Category.Id, x.Category.Name },
                LessonsCount = x.Lessons.Count,
                StudentsCount = _context.Enrollments.Count(e => e.CourseId == x.Id && e.IsActive),
                Revenue = _context.OrderItems.Where(i => i.CourseId == x.Id && i.Order.Status == NailCourse.Domain.Enums.OrderStatus.Paid).Sum(i => (decimal?)i.Price) ?? 0
            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpGet("courses/{courseId:guid}")]
    public async Task<IActionResult> Course(Guid courseId)
    {
        var course = await OwnedCourses()
            .Include(x => x.Lessons)
            .FirstOrDefaultAsync(x => x.Id == courseId);

        if (course == null) return NotFound(new { message = "Course not found or access denied." });

        return Ok(new
        {
            course.Id, course.Title, course.Slug, course.Description, course.Price, course.ThumbnailUrl,
            course.IsPublished, course.CategoryId, course.TeacherId,
            lessons = course.Lessons.OrderBy(x => x.Order).Select(x => new
            {
                x.Id, x.Title, x.Description, x.Order, x.DurationInMinutes, x.VideoId, x.IsFree
            })
        });
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] CourseInput dto)
    {
        if (CurrentUserId == null) return Unauthorized();
        if (dto.CategoryId == Guid.Empty || string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Slug))
            return BadRequest(new { message = "Category, title and slug are required." });
        if (dto.Price < 0) return BadRequest(new { message = "Price cannot be negative." });
        if (!await _context.Categories.AnyAsync(x => x.Id == dto.CategoryId)) return BadRequest(new { message = "Category not found." });
        if (await _context.Courses.AnyAsync(x => x.Slug == dto.Slug.Trim())) return Conflict(new { message = "Slug already exists." });

        var course = new Course
        {
            Id = Guid.NewGuid(), CategoryId = dto.CategoryId, TeacherId = IsAdmin ? (dto.TeacherId ?? CurrentUserId) : CurrentUserId,
            Title = dto.Title.Trim(), Slug = dto.Slug.Trim(), Description = dto.Description?.Trim() ?? string.Empty,
            Price = dto.Price, ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? null : dto.ThumbnailUrl.Trim(),
            IsPublished = dto.IsPublished, CreatedAt = DateTime.UtcNow
        };

        if (course.TeacherId == null)
            return BadRequest(new { message = "Teacher account not found." });

        var assignedTeacher = await _userManager.FindByIdAsync(course.TeacherId);
        if (assignedTeacher == null || !await _userManager.IsInRoleAsync(assignedTeacher, "Teacher") && !await _userManager.IsInRoleAsync(assignedTeacher, "Admin"))
            return BadRequest(new { message = "Teacher account not found." });

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Course), new { courseId = course.Id }, new { course.Id });
    }

    [HttpPut("courses/{courseId:guid}")]
    public async Task<IActionResult> UpdateCourse(Guid courseId, [FromBody] CourseInput dto)
    {
        var course = await FindOwnedCourse(courseId);
        if (course == null) return NotFound(new { message = "Course not found or access denied." });
        if (dto.Price < 0) return BadRequest(new { message = "Price cannot be negative." });
        if (!await _context.Categories.AnyAsync(x => x.Id == dto.CategoryId)) return BadRequest(new { message = "Category not found." });
        if (await _context.Courses.AnyAsync(x => x.Id != courseId && x.Slug == dto.Slug.Trim())) return Conflict(new { message = "Slug already exists." });

        course.CategoryId = dto.CategoryId; course.Title = dto.Title.Trim(); course.Slug = dto.Slug.Trim();
        course.Description = dto.Description?.Trim() ?? string.Empty; course.Price = dto.Price;
        course.ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? null : dto.ThumbnailUrl.Trim();
        course.IsPublished = dto.IsPublished; course.UpdatedAt = DateTime.UtcNow;
        if (IsAdmin && !string.IsNullOrWhiteSpace(dto.TeacherId)) course.TeacherId = dto.TeacherId;

        await _context.SaveChangesAsync();
        return Ok(new { course.Id });
    }

    [HttpDelete("courses/{courseId:guid}")]
    public async Task<IActionResult> ArchiveCourse(Guid courseId)
    {
        var course = await FindOwnedCourse(courseId);
        if (course == null) return NotFound(new { message = "Course not found or access denied." });
        course.IsPublished = false;
        course.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("courses/{courseId:guid}/lessons")]
    public async Task<IActionResult> AddLesson(Guid courseId, [FromBody] LessonInput dto)
    {
        var course = await FindOwnedCourse(courseId);
        if (course == null) return NotFound(new { message = "Course not found or access denied." });
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.DurationInMinutes < 0 || dto.Order < 1)
            return BadRequest(new { message = "Title, order and duration are required." });

        var lesson = new Lesson
        {
            Id = Guid.NewGuid(), CourseId = courseId, Title = dto.Title.Trim(), Description = dto.Description?.Trim(),
            Order = dto.Order, DurationInMinutes = dto.DurationInMinutes, VideoId = dto.VideoId?.Trim(), IsFree = dto.IsFree, CreatedAt = DateTime.UtcNow
        };
        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();
        return Ok(new { lesson.Id });
    }

    [HttpPut("lessons/{lessonId:guid}")]
    public async Task<IActionResult> UpdateLesson(Guid lessonId, [FromBody] LessonInput dto)
    {
        var lesson = await _context.Lessons.Include(x => x.Course).FirstOrDefaultAsync(x => x.Id == lessonId);
        if (lesson == null || (!IsAdmin && lesson.Course.TeacherId != CurrentUserId)) return NotFound(new { message = "Lesson not found or access denied." });
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.DurationInMinutes < 0 || dto.Order < 1)
            return BadRequest(new { message = "Title, order and duration are required." });

        lesson.Title = dto.Title.Trim(); lesson.Description = dto.Description?.Trim(); lesson.Order = dto.Order;
        lesson.DurationInMinutes = dto.DurationInMinutes; lesson.VideoId = dto.VideoId?.Trim(); lesson.IsFree = dto.IsFree;
        await _context.SaveChangesAsync();
        return Ok(new { lesson.Id });
    }

    [HttpDelete("lessons/{lessonId:guid}")]
    public async Task<IActionResult> DeleteLesson(Guid lessonId)
    {
        var lesson = await _context.Lessons.Include(x => x.Course).FirstOrDefaultAsync(x => x.Id == lessonId);
        if (lesson == null || (!IsAdmin && lesson.Course.TeacherId != CurrentUserId)) return NotFound(new { message = "Lesson not found or access denied." });
        _context.Lessons.Remove(lesson);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("payments")]
    public async Task<IActionResult> Payments([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var courseIds = OwnedCourses().Select(c => c.Id);
        var query = _context.Payments.AsNoTracking()
            .Include(x => x.Order).ThenInclude(x => x.Items).ThenInclude(x => x.Course)
            .Where(x => x.Order.Items.Any(i => courseIds.Contains(i.CourseId)));
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new
            {
                x.Id, x.OrderId, x.Amount, x.Authority, x.ReferenceId, x.IsSuccessful, x.CreatedAt, x.PaidAt,
                status = x.Order.Status.ToString(), userId = x.Order.UserId,
                courses = x.Order.Items.Select(i => new { i.CourseId, title = i.Course.Title }).ToList()
            }).ToListAsync();

        var userIds = items.Select(x => x.userId).Distinct().ToList();
        var users = await _userManager.Users.Where(x => userIds.Contains(x.Id)).Select(x => new { x.Id, x.Email, x.FirstName, x.LastName }).ToListAsync();
        var userMap = users.ToDictionary(x => x.Id);
        return Ok(new { page, pageSize, total, items = items.Select(x => new
        {
            x.Id, x.OrderId, x.Amount, x.Authority, x.ReferenceId, x.IsSuccessful, x.CreatedAt, x.PaidAt, x.status,
            user = userMap.TryGetValue(x.userId, out var u) ? new { u.Email, u.FirstName, u.LastName } : null,
            x.courses
        })});
    }

    [HttpGet("students")]
    public async Task<IActionResult> Students([FromQuery] int page = 1, [FromQuery] int pageSize = 30)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var courseIds = OwnedCourses().Select(c => c.Id);
        var baseQuery = _context.Enrollments.AsNoTracking().Where(x => x.IsActive && courseIds.Contains(x.CourseId)).GroupBy(x => x.UserId);
        var total = await baseQuery.CountAsync();
        var rows = await baseQuery.OrderByDescending(g => g.Max(x => x.EnrolledAt)).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(g => new { userId = g.Key, courses = g.Select(x => x.CourseId).Distinct().Count(), lastEnrolledAt = g.Max(x => x.EnrolledAt), averageProgress = g.Average(x => x.Progress) }).ToListAsync();
        var ids = rows.Select(x => x.userId).ToList();
        var users = await _userManager.Users.Where(x => ids.Contains(x.Id)).Select(x => new { x.Id, x.Email, x.FirstName, x.LastName }).ToListAsync();
        var map = users.ToDictionary(x => x.Id);
        return Ok(new { page, pageSize, total, items = rows.Select(x => new { x.userId, x.courses, x.lastEnrolledAt, x.averageProgress, user = map.TryGetValue(x.userId, out var u) ? new { u.Email, u.FirstName, u.LastName } : null })});
    }

    [HttpGet("categories")]
    public async Task<IActionResult> Categories() => Ok(await _context.Categories.AsNoTracking().OrderBy(x => x.Name).Select(x => new { x.Id, x.Name, x.Slug }).ToListAsync());

    public sealed class CourseInput
    {
        public Guid CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ThumbnailUrl { get; set; }
        public bool IsPublished { get; set; }
        public string? TeacherId { get; set; }
    }

    public sealed class LessonInput
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public int DurationInMinutes { get; set; }
        public string? VideoId { get; set; }
        public bool IsFree { get; set; }
    }
}
