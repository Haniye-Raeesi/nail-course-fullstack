using NailCourse.Application.Interfaces;

namespace NailCourse.Infrastructure.Services;

public class MockPaymentService : IPaymentService
{
    public Task<PaymentRequestResult> CreatePaymentAsync(
        Guid orderId,
        decimal amount)
    {
        var authority = Guid.NewGuid().ToString("N");

        return Task.FromResult(
            new PaymentRequestResult(
                true,
                authority,
                $"https://example.com/payment/{authority}",
                null));
    }

    public Task<PaymentVerificationResult> VerifyPaymentAsync(
        Guid orderId,
        string authority)
    {
        return Task.FromResult(
            new PaymentVerificationResult(
                true,
                Random.Shared.Next(100000, 999999).ToString(),
                null));
    }
}