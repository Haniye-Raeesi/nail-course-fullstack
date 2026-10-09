using NailCourse.Domain.Entities;

namespace NailCourse.Application.Services;

public interface ISpotPlayerService
{
    Task<SpotPlayerLicense> CreateLicenseAsync(
        Course course,
        string customerName,
        string? payload = null,
        bool test = true);
}