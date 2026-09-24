using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using NailCourse.Application.Services;
using NailCourse.Domain.Entities;

namespace NailCourse.Infrastructure.Services;

public class SpotPlayerService : ISpotPlayerService
{
    private readonly IConfiguration _configuration;

    public SpotPlayerService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<SpotPlayerLicense> CreateLicenseAsync(
        Guid courseId,
        string customerName,
        string? payload = null,
        bool test = true)
    {
        var apiKey = _configuration["SpotPlayer:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "SpotPlayer API Key is not configured.");

        var spotCourseId =
            _configuration["SpotPlayer:CourseId"];

        if (string.IsNullOrWhiteSpace(spotCourseId))
            throw new InvalidOperationException(
                "SpotPlayer CourseId is not configured.");

        using var client = new HttpClient();

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://panel.spotplayer.ir/license/edit/");

        request.Headers.Add("$API", apiKey);
        request.Headers.Add("$LEVEL", "-1");

        var body = new
        {
            test,

            course = new[]
            {
                spotCourseId
            },

            name = customerName,

            payload,

            watermark = new
            {
                texts = new[]
                {
                    new
                    {
                        text = customerName
                    }
                }
            },

            device = new
            {
                p0 = 1,
                p1 = 1,
                p2 = 0,
                p3 = 0,
                p4 = 0,
                p5 = 0,
                p6 = 0
            }
        };

        var json = JsonSerializer.Serialize(body);

        request.Content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        var response = await client.SendAsync(request);

        var result =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"SpotPlayer API error: {result}");
        }

        var data =
            JsonSerializer.Deserialize<SpotPlayerResponse>(
                result,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

        if (data == null ||
            string.IsNullOrWhiteSpace(data.Id) ||
            string.IsNullOrWhiteSpace(data.Key))
        {
            throw new Exception(
                $"Invalid SpotPlayer response: {result}");
        }

        return new SpotPlayerLicense
        {
            CourseId = courseId,
            SpotPlayerLicenseId = data.Id,
            LicenseKey = data.Key,
            LicenseUrl = data.Url ?? string.Empty,
            Payload = payload,
            IsTest = test
        };
    }

    private class SpotPlayerResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("url")]
    public string? Url { get; set; }
}
}