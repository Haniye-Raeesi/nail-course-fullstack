using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailCourse.Application.Interfaces;
using NailCourse.Application.Services;
using NailCourse.Domain.Entities;
using NailCourse.Domain.Enums;
using NailCourse.Infrastructure.Data;
using System.Security.Claims;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly IOrderCompletionService _orderCompletionService;

    public PaymentsController(
        ApplicationDbContext context,
        IPaymentService paymentService,
        IOrderCompletionService orderCompletionService)
    {
        _context = context;
        _paymentService = paymentService;
        _orderCompletionService = orderCompletionService;
    }

    [HttpPost("request/{orderId:guid}")]
    public async Task<IActionResult> RequestPayment(Guid orderId)
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

        var result = await _paymentService.CreatePaymentAsync(
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
            CreatedAt = DateTime.UtcNow,
            IsSuccessful = false
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

        if (order.Status == OrderStatus.Paid)
        {
            return Ok(new
            {
                status = "already_paid",
                orderId
            });
        }

        var payment = await _context.Payments
            .FirstOrDefaultAsync(x =>
                x.OrderId == orderId &&
                x.Authority == authority);

        if (payment == null)
            return NotFound(new
            {
                message = "Payment record not found."
            });

        var result = await _paymentService.VerifyPaymentAsync(
            orderId,
            authority);

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

        await _context.SaveChangesAsync();

        /*
         * پرداخت با موفقیت تأیید شد.
         *
         * از اینجا:
         * Order → Enrollment → SpotPlayer License
         */
        try
        {
            await _orderCompletionService
                .CompletePaidOrderAsync(order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message =
                    "Payment was successful, but course activation failed.",
                detail = ex.Message
            });
        }

        return Ok(new
        {
            status = "success",
            orderId,
            referenceId = result.ReferenceId
        });
    }
}