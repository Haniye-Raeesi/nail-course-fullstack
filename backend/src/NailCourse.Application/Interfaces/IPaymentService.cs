namespace NailCourse.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentRequestResult> CreatePaymentAsync(
        Guid orderId,
        decimal amount);

    Task<PaymentVerificationResult> VerifyPaymentAsync(
        Guid orderId,
        string authority);
}

public record PaymentRequestResult(
    bool IsSuccessful,
    string? Authority,
    string? PaymentUrl,
    string? ErrorMessage);

public record PaymentVerificationResult(
    bool IsSuccessful,
    string? ReferenceId,
    string? ErrorMessage);