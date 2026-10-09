using Microsoft.Extensions.Configuration;
using NailCourse.Application.Interfaces;

namespace NailCourse.Infrastructure.Services;

public class ZarinpalPaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public ZarinpalPaymentService(
        IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<PaymentRequestResult> CreatePaymentAsync(
        Guid orderId,
        decimal amount)
    {
        // Sandbox داخلی موقت
        // فعلاً نیازی به MerchantId نداریم.

        var authority =
            "SANDBOX-" + Guid.NewGuid().ToString("N");

        var paymentUrl =
            $"https://localhost:5281/api/payments/sandbox-pay/{authority}";

        return Task.FromResult(
            new PaymentRequestResult(
                true,
                authority,
                paymentUrl,
                null));
    }

    public Task<PaymentVerificationResult> VerifyPaymentAsync(
        Guid orderId,
        string authority)
    {
        // فعلاً پرداخت را موفق در نظر می‌گیریم.
        // بعداً این قسمت با Verify واقعی زرین‌پال جایگزین می‌شود.

        if (string.IsNullOrWhiteSpace(authority) ||
            !authority.StartsWith("SANDBOX-"))
        {
            return Task.FromResult(
                new PaymentVerificationResult(
                    false,
                    null,
                    "Invalid sandbox authority."));
        }

        var referenceId =
            "SANDBOX-REF-" +
            Guid.NewGuid().ToString("N");

        return Task.FromResult(
            new PaymentVerificationResult(
                true,
                referenceId,
                null));
    }
}