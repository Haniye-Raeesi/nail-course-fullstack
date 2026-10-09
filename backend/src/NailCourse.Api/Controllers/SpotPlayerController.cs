using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.Services;
using NailCourse.Infrastructure.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace NailCourse.Api.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SpotPlayerController : ControllerBase
{
    private readonly ISpotPlayerService _spotPlayerService;
    private readonly ApplicationDbContext _db;

    public SpotPlayerController(
        ISpotPlayerService spotPlayerService,
        ApplicationDbContext db)
    {
        _spotPlayerService = spotPlayerService;
        _db = db;
    }

    [HttpPost("create-license")]
    public async Task<IActionResult> CreateLicense()
    {
        var courseId = Guid.Parse("20000000-0000-0000-0000-000000000001");

        var course = await _db.Courses
            .FirstOrDefaultAsync(x => x.Id == courseId);

        if (course == null)
        {
            return NotFound(new
            {
                message = "Course not found."
            });
        }

        var license =
            await _spotPlayerService.CreateLicenseAsync(
                course,
                "Test Student",
                "test-enrollment-001",
                true);

        _db.SpotPlayerLicenses.Add(license);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            license.Id,
            license.SpotPlayerLicenseId,
            license.LicenseKey,
            license.LicenseUrl
        });
    }
    [HttpGet("my-license/{courseId:guid}")]
public async Task<IActionResult> GetMyLicense(Guid courseId)
{
    var userId = User.FindFirstValue(
        ClaimTypes.NameIdentifier
    );

    if (string.IsNullOrWhiteSpace(userId))
        return Unauthorized();

    var license = await _db.SpotPlayerLicenses
        .AsNoTracking()
        .Include(x => x.Enrollment)
        .FirstOrDefaultAsync(x =>
            x.CourseId == courseId &&
            x.Enrollment != null &&
            x.Enrollment.UserId == userId &&
            x.Enrollment.IsActive);

    if (license == null)
    {
        return NotFound(new
        {
            message = "Active SpotPlayer license not found."
        });
    }

    return Ok(new
    {
        license.SpotPlayerLicenseId,
        license.LicenseKey,
        license.LicenseUrl,
        license.IsTest
    });
}
}



