using Microsoft.AspNetCore.Mvc;
using NailCourse.Application.Services;
using NailCourse.Infrastructure.Data;

namespace NailCourse.Api.Controllers;

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
        // فعلاً تستی
        // بعداً از Enrollment واقعی می‌گیریم

        var courseId = Guid.Parse(
            "20000000-0000-0000-0000-000000000001");


        var license =
            await _spotPlayerService.CreateLicenseAsync(
                courseId,
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
}