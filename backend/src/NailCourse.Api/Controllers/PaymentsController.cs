using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.Interfaces;
using NailCourse.Domain.Enums;
using NailCourse.Infrastructure.Data;
using NailCourse.Domain.Entities;
using System.Security.Claims;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;

    public PaymentsController(
        ApplicationDbContext context,
        IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    [HttpPost("request/{orderId:guid}")]
    public async Task<IActionResult> RequestPayment(
        Guid orderId)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var order = await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.UserId == userId);

        if (order == null)
            return NotFound();

        if (order.Status != OrderStatus.Pending)
        {
            return BadRequest(new
            {
                message = "Order cannot be paid."
            });
        }

        var result =
            await _paymentService.CreatePaymentAsync(
                order.Id,
                order.TotalAmount);

        if (!result.IsSuccessful)
        {
            return BadRequest(new
            {
                message = result.ErrorMessage
            });
        }

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Amount = order.TotalAmount,
            Authority = result.Authority,
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            orderId = order.Id,
            paymentUrl = result.PaymentUrl,
            authority = result.Authority
        });
    }

    [HttpGet("verify/{orderId:guid}")]
    public async Task<IActionResult> VerifyPayment(
        Guid orderId,
        [FromQuery] string authority)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var order = await _context.Orders
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.UserId == userId);

        if (order == null)
            return NotFound();

        var result =
            await _paymentService.VerifyPaymentAsync(
                orderId,
                authority);

        var payment = await _context.Payments
            .FirstOrDefaultAsync(x =>
                x.OrderId == orderId &&
                x.Authority == authority);

        if (payment == null)
            return NotFound();

        if (!result.IsSuccessful)
        {
            payment.IsSuccessful = false;

            order.Status = OrderStatus.Failed;

            await _context.SaveChangesAsync();

            return BadRequest(new
            {
                message = result.ErrorMessage
            });
        }

        payment.IsSuccessful = true;
        payment.ReferenceId = result.ReferenceId;
        payment.PaidAt = DateTime.UtcNow;

        order.Status = OrderStatus.Paid;
        order.PaidAt = DateTime.UtcNow;

        foreach (var item in order.Items)
        {
            var exists = await _context.Enrollments
                .AnyAsync(x =>
                    x.UserId == userId &&
                    x.CourseId == item.CourseId);

            if (!exists)
            {
                _context.Enrollments.Add(
                    new Enrollment
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        CourseId = item.CourseId,
                        EnrolledAt = DateTime.UtcNow,
                        IsActive = true,
                        Progress = 0
                    });
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            status = "success",
            orderId,
            referenceId = result.ReferenceId
        });
    }
}