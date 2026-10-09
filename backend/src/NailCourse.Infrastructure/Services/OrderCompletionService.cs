using Microsoft.EntityFrameworkCore;
using NailCourse.Application.Services;
using NailCourse.Domain.Entities;
using NailCourse.Domain.Enums;
using NailCourse.Infrastructure.Data;

namespace NailCourse.Infrastructure.Services;

public class OrderCompletionService : IOrderCompletionService
{
    private readonly ApplicationDbContext _db;
    private readonly ISpotPlayerService _spotPlayerService;

    public OrderCompletionService(
        ApplicationDbContext db,
        ISpotPlayerService spotPlayerService)
    {
        _db = db;
        _spotPlayerService = spotPlayerService;
    }

    public async Task CompletePaidOrderAsync(Order order)
    {
        if (order.Status != OrderStatus.Paid)
        {
            throw new InvalidOperationException(
                "Only paid orders can be completed.");
        }

        var user = await _db.Users
            .FirstOrDefaultAsync(x => x.Id == order.UserId);

        if (user == null)
        {
            throw new InvalidOperationException(
                "Customer was not found.");
        }

        var customerName =
            $"{user.FirstName} {user.LastName}".Trim();

        if (string.IsNullOrWhiteSpace(customerName))
        {
            customerName = user.UserName ?? user.Email ?? order.UserId;
        }
foreach (var item in order.Items)
{
    var course = await _db.Courses
        .FirstOrDefaultAsync(x => x.Id == item.CourseId);

    if (course == null)
    {
        throw new InvalidOperationException(
            $"Course '{item.CourseId}' was not found.");
    }

    var enrollment = await _db.Enrollments
        .FirstOrDefaultAsync(x =>
            x.UserId == order.UserId &&
            x.CourseId == item.CourseId);

    if (enrollment == null)
{
    enrollment = new Enrollment
    {
        Id = Guid.NewGuid(),
        UserId = order.UserId,
        CourseId = item.CourseId,
        EnrolledAt = DateTime.UtcNow,
        IsActive = true,
        Progress = 0
    };

    _db.Enrollments.Add(enrollment);

    await _db.SaveChangesAsync();
}
else if (!enrollment.IsActive)
{
    enrollment.IsActive = true;
}

    var existingLicense = await _db.SpotPlayerLicenses
        .FirstOrDefaultAsync(x =>
            x.OrderId == order.Id &&
            x.CourseId == item.CourseId);

    if (existingLicense != null)
        continue;

    var license =
        await _spotPlayerService.CreateLicenseAsync(
            course,
            customerName,
            order.Id.ToString(),
            true);

    license.OrderId = order.Id;
    license.EnrollmentId = enrollment.Id;

    _db.SpotPlayerLicenses.Add(license);
}

        await _db.SaveChangesAsync();
    }
}