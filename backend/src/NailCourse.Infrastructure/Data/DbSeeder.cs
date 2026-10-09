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

    // =========================================================
    // Categories
    // =========================================================

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

    // =========================================================
    // Courses
    // =========================================================

    private static async Task SeedCoursesAsync(ApplicationDbContext context)
    {
        var course1Id =
            Guid.Parse("20000000-0000-0000-0000-000000000001");

        var course2Id =
            Guid.Parse("20000000-0000-0000-0000-000000000002");

        var course3Id =
            Guid.Parse("20000000-0000-0000-0000-000000000003");

        var specializedCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000001");

        var manicureCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000002");

        var nailArtCategoryId =
            Guid.Parse("10000000-0000-0000-0000-000000000003");

        var teacherId =
            "d140078e-4e37-4abb-ba59-66615e61bb74";

        var now = DateTime.UtcNow;

        // =====================================================
        // Course 1
        // =====================================================

        var course1 = await context.Courses
            .FirstOrDefaultAsync(c => c.Id == course1Id);

        if (course1 == null)
        {
            course1 = new Course
            {
                Id = course1Id,
                CategoryId = specializedCategoryId,

                // مالک دوره
                TeacherId = teacherId,

                Title = "دوره جامع آموزش کاشت و طراحی ناخن",
                Slug = "comprehensive-nail-course",
                Description = "آموزش جامع کاشت و طراحی ناخن",
                Price = 100000,

                IsPublished = true,
                CreatedAt = now
            };

            context.Courses.Add(course1);
        }
        else
        {
            // فقط مالک دوره را اصلاح می‌کنیم.
            // SpotPlayerCourseId دست‌نخورده باقی می‌ماند.
            course1.TeacherId = teacherId;
            course1.UpdatedAt = now;
        }

        // =====================================================
        // Course 2
        // =====================================================

        if (!await context.Courses.AnyAsync(x => x.Id == course2Id))
        {
            context.Courses.Add(new Course
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

        // =====================================================
        // Course 3
        // =====================================================

        if (!await context.Courses.AnyAsync(x => x.Id == course3Id))
        {
            context.Courses.Add(new Course
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

        await context.SaveChangesAsync();

        // بعد از ایجاد Courseها، Lessonها را Seed می‌کنیم.
        await SeedLessonsAsync(
            context,
            course1Id,
            course2Id,
            course3Id);
    }

    // =========================================================
    // Lessons
    // =========================================================

    private static async Task SeedLessonsAsync(
        ApplicationDbContext context,
        Guid course1Id,
        Guid course2Id,
        Guid course3Id)
    {
        // =====================================================
        // Lesson 1 - Course 1
        // =====================================================

        var lesson1Id =
            Guid.Parse("30000000-0000-0000-0000-000000000001");

        var lesson1 = await context.Lessons
            .FirstOrDefaultAsync(l => l.Id == lesson1Id);

        if (lesson1 == null)
        {
            lesson1 = new Lesson
            {
                Id = lesson1Id,
                CourseId = course1Id,

                Title = "معرفی دوره و ابزارهای مورد نیاز",
                Description = "آشنایی با دوره و ابزارهای مورد نیاز",

                Order = 1,
                DurationInMinutes = 15,

                // Video واقعی SpotPlayer
                VideoId = "6aae1249e961383f8f2b1e79",

                IsFree = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Lessons.Add(lesson1);
        }
        else
        {
            // اگر Lesson قبلاً ساخته شده،
            // فقط VideoId واقعی SpotPlayer را اصلاح می‌کنیم.
            lesson1.VideoId = "6aae1249e961383f8f2b1e79";
        }

        // =====================================================
        // Lesson 2 - Course 1
        // =====================================================

        var lesson2Id =
            Guid.Parse("30000000-0000-0000-0000-000000000002");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson2Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson2Id,
                CourseId = course1Id,

                Title = "آماده‌سازی صحیح ناخن",
                Description = "مراحل آماده‌سازی ناخن قبل از شروع کار.",

                Order = 2,
                DurationInMinutes = 25,

                VideoId = null,
                IsFree = false,

                CreatedAt = DateTime.UtcNow
            });
        }

        // =====================================================
        // Lesson 3 - Course 1
        // =====================================================

        var lesson3Id =
            Guid.Parse("30000000-0000-0000-0000-000000000003");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson3Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson3Id,
                CourseId = course1Id,

                Title = "آموزش مراحل اجرای کاشت",
                Description = "اجرای مرحله‌به‌مرحله کاشت ناخن.",

                Order = 3,
                DurationInMinutes = 35,

                VideoId = null,
                IsFree = false,

                CreatedAt = DateTime.UtcNow
            });
        }

        // =====================================================
        // Lesson 4 - Course 2
        // =====================================================

        var lesson4Id =
            Guid.Parse("30000000-0000-0000-0000-000000000004");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson4Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson4Id,
                CourseId = course2Id,

                Title = "مبانی مانیکور",
                Description = "آشنایی با اصول و ابزارهای مانیکور.",

                Order = 1,
                DurationInMinutes = 20,

                VideoId = null,
                IsFree = true,

                CreatedAt = DateTime.UtcNow
            });
        }

        // =====================================================
        // Lesson 5 - Course 2
        // =====================================================

        var lesson5Id =
            Guid.Parse("30000000-0000-0000-0000-000000000005");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson5Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson5Id,
                CourseId = course2Id,

                Title = "اجرای مانیکور حرفه‌ای",
                Description = "اجرای کامل مانیکور حرفه‌ای.",

                Order = 2,
                DurationInMinutes = 30,

                VideoId = null,
                IsFree = false,

                CreatedAt = DateTime.UtcNow
            });
        }

        // =====================================================
        // Lesson 6 - Course 3
        // =====================================================

        var lesson6Id =
            Guid.Parse("30000000-0000-0000-0000-000000000006");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson6Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson6Id,
                CourseId = course3Id,

                Title = "مبانی طراحی ناخن",
                Description = "آشنایی با اصول اولیه طراحی.",

                Order = 1,
                DurationInMinutes = 20,

                VideoId = null,
                IsFree = true,

                CreatedAt = DateTime.UtcNow
            });
        }

        // =====================================================
        // Lesson 7 - Course 3
        // =====================================================

        var lesson7Id =
            Guid.Parse("30000000-0000-0000-0000-000000000007");

        if (!await context.Lessons.AnyAsync(x => x.Id == lesson7Id))
        {
            context.Lessons.Add(new Lesson
            {
                Id = lesson7Id,
                CourseId = course3Id,

                Title = "تکنیک‌های طراحی حرفه‌ای",
                Description = "اجرای تکنیک‌های حرفه‌ای طراحی ناخن.",

                Order = 2,
                DurationInMinutes = 40,

                VideoId = null,
                IsFree = false,

                CreatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }
}