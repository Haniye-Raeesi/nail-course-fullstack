using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.DTOs;
using NailCourse.Domain.Entities;
using NailCourse.Domain.Enums;
using NailCourse.Infrastructure.Data;
using System.Security.Claims;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        CreateOrderDto dto)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        if (dto.CourseIds == null || dto.CourseIds.Count == 0)
        {
            return BadRequest(new
            {
                message = "No courses selected."
            });
        }

        var courseIds = dto.CourseIds
            .Distinct()
            .ToList();

        var courses = await _context.Courses
            .Where(x =>
                courseIds.Contains(x.Id) &&
                x.IsPublished)
            .ToListAsync();

        if (courses.Count != courseIds.Count)
        {
            return BadRequest(new
            {
                message = "One or more courses are unavailable."
            });
        }

        var alreadyOwned = await _context.Enrollments
            .AnyAsync(x =>
                x.UserId == userId &&
                x.IsActive &&
                courseIds.Contains(x.CourseId));

        if (alreadyOwned)
        {
            return BadRequest(new
            {
                message = "One or more courses are already purchased."
            });
        }

        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = courses.Sum(x => x.Price)
        };

        foreach (var course in courses)
        {
            order.Items.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                CourseId = course.Id,
                Price = course.Price
            });
        }

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            orderId = order.Id,
            totalAmount = order.TotalAmount,
            status = order.Status.ToString()
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var orders = await _context.Orders
            .Where(x => x.UserId == userId)
            .Include(x => x.Items)
            .ThenInclude(x => x.Course)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.TotalAmount,
                Status = x.Status.ToString(),
                x.CreatedAt,
                x.PaidAt,

                Items = x.Items.Select(i => new
                {
                    i.CourseId,
                    CourseTitle = i.Course.Title,
                    i.Price
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var order = await _context.Orders
            .Where(x =>
                x.Id == id &&
                x.UserId == userId)
            .Include(x => x.Items)
            .ThenInclude(x => x.Course)
            .Select(x => new
            {
                x.Id,
                x.TotalAmount,
                Status = x.Status.ToString(),
                x.CreatedAt,
                x.PaidAt,

                Items = x.Items.Select(i => new
                {
                    i.CourseId,
                    CourseTitle = i.Course.Title,
                    i.Price
                })
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound();

        return Ok(order);
    }
}