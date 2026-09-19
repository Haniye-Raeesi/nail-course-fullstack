using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NailCourse.Domain.Entities;
using NailCourse.Infrastructure.Identity;

namespace NailCourse.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<LessonProgress> LessonProgresses => Set<LessonProgress>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Order> Orders => Set<Order>();

public DbSet<OrderItem> OrderItems => Set<OrderItem>();

public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Order>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.UserId)
        .IsRequired()
        .HasMaxLength(450);

    entity.Property(x => x.TotalAmount)
        .HasPrecision(18, 2);

    entity.HasMany(x => x.Items)
        .WithOne(x => x.Order)
        .HasForeignKey(x => x.OrderId)
        .OnDelete(DeleteBehavior.Cascade);
});

builder.Entity<OrderItem>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Price)
        .HasPrecision(18, 2);

    entity.HasOne(x => x.Course)
        .WithMany()
        .HasForeignKey(x => x.CourseId)
        .OnDelete(DeleteBehavior.Restrict);
});

builder.Entity<Payment>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Amount)
        .HasPrecision(18, 2);

    entity.Property(x => x.Authority)
        .HasMaxLength(200);

    entity.Property(x => x.ReferenceId)
        .HasMaxLength(200);

    entity.HasOne(x => x.Order)
        .WithMany()
        .HasForeignKey(x => x.OrderId)
        .OnDelete(DeleteBehavior.Cascade);
});
        builder.Entity<Enrollment>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.UserId)
        .IsRequired()
        .HasMaxLength(450);

    entity.Property(x => x.Progress)
        .HasPrecision(5, 2);

    entity.HasOne(x => x.Course)
        .WithMany()
        .HasForeignKey(x => x.CourseId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(x => new
    {
        x.UserId,
        x.CourseId
    })
    .IsUnique();
});

        builder.Entity<Course>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Description)
                .HasMaxLength(5000);

            entity.Property(x => x.TeacherId)
                .HasMaxLength(450);

            entity.HasIndex(x => x.TeacherId);

            entity.Property(x => x.Price)
                .HasPrecision(18, 2);

            entity.HasMany(x => x.Lessons)
                .WithOne(x => x.Course)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(x => x.Category)
    .WithMany(x => x.Courses)
    .HasForeignKey(x => x.CategoryId)
    .OnDelete(DeleteBehavior.Restrict);
        });

builder.Entity<Lesson>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Title)
        .IsRequired()
        .HasMaxLength(200);

    entity.Property(x => x.Description)
        .HasMaxLength(5000);

    entity.Property(x => x.VideoId)
        .HasMaxLength(500);
});
builder.Entity<LessonProgress>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.UserId)
        .IsRequired()
        .HasMaxLength(450);

    entity.Property(x => x.WatchedSeconds)
        .HasPrecision(12, 2);

    entity.Property(x => x.DurationSeconds)
        .HasPrecision(12, 2);

    entity.Property(x => x.ProgressPercent)
        .HasPrecision(5, 2);

    entity.Property(x => x.LastPositionSeconds)
        .HasPrecision(12, 2);

    entity.HasOne(x => x.Lesson)
        .WithMany()
        .HasForeignKey(x => x.LessonId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(x => new
    {
        x.UserId,
        x.LessonId
    })
    .IsUnique();
});

        builder.Entity<Category>(entity =>
{
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Name)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(x => x.Slug)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(x => x.Description)
        .HasMaxLength(1000);

    entity.HasMany(x => x.Courses)
        .WithOne(x => x.Category)
        .HasForeignKey(x => x.CategoryId)
        .OnDelete(DeleteBehavior.Restrict);
});
    }
}