using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Infrastructure.Data;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.Description,
                CoursesCount = x.Courses.Count
            })
            .ToListAsync();

        return Ok(categories);
    }
}