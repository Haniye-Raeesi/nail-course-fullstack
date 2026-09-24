using Microsoft.EntityFrameworkCore;
using NailCourse.Domain.Entities;

namespace NailCourse.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        Console.WriteLine("========== DB SEEDER STARTED ==========");

        await context.Database.MigrateAsync();

        await SeedCategoriesAsync(context);
        await SeedCoursesAsync(context);

        Console.WriteLine("========== DB SEEDER FINISHED ==========");
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext context)
    {
        var categories = new[]
        {
            new Category
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                Name = "آموزش‌های تخصصی ناخن",
                Slug = "nail-specialized",
                Description = "دوره‌های تخصصی آموزش طراحی و خدمات ناخن",
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                Name = "مانیکور و پدیکور",
                Slug = "manicure-pedicure",
                Description = "آموزش اصولی مانیکور و پدیکور",
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                Name = "طراحی ناخن",
                Slug = "nail-art",
                Description = "آموزش تکنیک‌های طراحی و دیزاین ناخن",
                IsActive = true
            }
        };

        foreach (var category in categories)
        {
            var exists = await context.Categories
                .AnyAsync(x => x.Id == category.Id);

            if (!exists)
            {
                await context.Categories.AddAsync(category);
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedCoursesAsync(ApplicationDbContext context)
    {
        var course1Id = Guid.Parse("20000000-0000-0000-0000-000000000001");
        var course2Id = Guid.Parse("20000000-0000-0000-0000-000000000002");
        var course3Id = Guid.Parse("20000000-0000-0000-0000-000000000003");

        var specializedCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000001");

        var manicureCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000002");

        var nailArtCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000003");

        var now = DateTime.UtcNow;

        var courses = new List<Course>();

        if (!await context.Courses.AnyAsync(x => x.Id == course1Id))
        {
            courses.Add(new Course
            {
                Id = course1Id,
                CategoryId = specializedCategoryId,
                TeacherId = null,
                Title = "دوره جامع آموزش کاشت و طراحی ناخن",
                Slug = "comprehensive-nail-course",
                Description =
                    "دوره جامع و پروژه‌محور آموزش مهارت‌های تخصصی ناخن از پایه تا پیشرفته.",
                Price = 0,
                ThumbnailUrl = "/images/courses/course-1.jpg",
                IsPublished = true,
                CreatedAt = now
            });
        }

        if (!await context.Courses.AnyAsync(x => x.Id == course2Id))
        {
            courses.Add(new Course
            {
                Id = course2Id,
                CategoryId = manicureCategoryId,
                TeacherId = null,
                Title = "دوره تخصصی مانیکور",
                Slug = "professional-manicure",
                Description =
                    "آموزش اصولی مانیکور، آماده‌سازی ناخن و اجرای صحیح مراحل کار.",
                Price = 0,
                ThumbnailUrl = "/images/courses/course-2.jpg",
                IsPublished = true,
                CreatedAt = now
            });
        }

        if (!await context.Courses.AnyAsync(x => x.Id == course3Id))
        {
            courses.Add(new Course
            {
                Id = course3Id,
                CategoryId = nailArtCategoryId,
                TeacherId = null,
                Title = "دوره طراحی و دیزاین ناخن",
                Slug = "nail-art-design",
                Description =
                    "آموزش تکنیک‌های کاربردی طراحی و دیزاین حرفه‌ای ناخن.",
                Price = 0,
                ThumbnailUrl = "/images/courses/course-3.jpg",
                IsPublished = true,
                CreatedAt = now
            });
        }

        if (courses.Count > 0)
        {
            await context.Courses.AddRangeAsync(courses);
            await context.SaveChangesAsync();
        }

        await SeedLessonsAsync(context, course1Id, course2Id, course3Id);
    }

    private static async Task SeedLessonsAsync(
        ApplicationDbContext context,
        Guid course1Id,
        Guid course2Id,
        Guid course3Id)
    {
        var lessons = new[]
        {
            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000001"),
                CourseId = course1Id,
                Title = "معرفی دوره و ابزارهای مورد نیاز",
                Description = "آشنایی با مسیر دوره و ابزارهای اصلی.",
                Order = 1,
                DurationInMinutes = 15,
                VideoId = "test-video-001",
                IsFree = true,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000002"),
                CourseId = course1Id,
                Title = "آماده‌سازی صحیح ناخن",
                Description = "مراحل آماده‌سازی ناخن قبل از شروع کار.",
                Order = 2,
                DurationInMinutes = 25,
                VideoId = null,
                IsFree = false,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000003"),
                CourseId = course1Id,
                Title = "آموزش مراحل اجرای کاشت",
                Description = "اجرای مرحله‌به‌مرحله کاشت ناخن.",
                Order = 3,
                DurationInMinutes = 35,
                VideoId = null,
                IsFree = false,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000004"),
                CourseId = course2Id,
                Title = "مبانی مانیکور",
                Description = "آشنایی با اصول و ابزارهای مانیکور.",
                Order = 1,
                DurationInMinutes = 20,
                VideoId = null,
                IsFree = true,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000005"),
                CourseId = course2Id,
                Title = "اجرای مانیکور حرفه‌ای",
                Description = "اجرای کامل مانیکور حرفه‌ای.",
                Order = 2,
                DurationInMinutes = 30,
                VideoId = null,
                IsFree = false,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000006"),
                CourseId = course3Id,
                Title = "مبانی طراحی ناخن",
                Description = "آشنایی با اصول اولیه طراحی.",
                Order = 1,
                DurationInMinutes = 20,
                VideoId = null,
                IsFree = true,
                CreatedAt = DateTime.UtcNow
            },

            new Lesson
            {
                Id = Guid.Parse("30000000-0000-0000-0000-000000000007"),
                CourseId = course3Id,
                Title = "تکنیک‌های طراحی حرفه‌ای",
                Description = "اجرای تکنیک‌های حرفه‌ای طراحی ناخن.",
                Order = 2,
                DurationInMinutes = 40,
                VideoId = null,
                IsFree = false,
                CreatedAt = DateTime.UtcNow
            }
        };

        foreach (var lesson in lessons)
        {
            var exists = await context.Lessons
                .AnyAsync(x => x.Id == lesson.Id);

            if (!exists)
            {
                await context.Lessons.AddAsync(lesson);
            }
        }

        await context.SaveChangesAsync();
    }
}