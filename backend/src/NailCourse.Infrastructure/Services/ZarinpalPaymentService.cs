using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using NailCourse.Application.Interfaces;

namespace NailCourse.Infrastructure.Services;

public class ZarinpalPaymentService : IPaymentService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ZarinpalPaymentService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<PaymentRequestResult> CreatePaymentAsync(
        Guid orderId,
        decimal amount)
    {
        var merchantId =
            _configuration["Zarinpal:MerchantId"];

        var callbackUrl =
            _configuration["Zarinpal:CallbackUrl"];

        if (string.IsNullOrWhiteSpace(merchantId) ||
            merchantId == "YOUR-MERCHANT-ID")
        {
            return new PaymentRequestResult(
                false,
                null,
                null,
                "Zarinpal MerchantId is not configured.");
        }

        var request = new
        {
            merchant_id = merchantId,
            amount = (long)amount,
            description = $"NailCourse Order {orderId}",
            callback_url = callbackUrl
        };

        var response = await _httpClient.PostAsJsonAsync(
            "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
            request);

        if (!response.IsSuccessStatusCode)
        {
            return new PaymentRequestResult(
                false,
                null,
                null,
                "Zarinpal request failed.");
        }

        var result =
            await response.Content.ReadFromJsonAsync<ZarinpalRequestResponse>();

        if (result?.Data?.Code != 100)
        {
            return new PaymentRequestResult(
                false,
                null,
                null,
                "Zarinpal payment request was rejected.");
        }

        var authority = result.Data.Authority;

        return new PaymentRequestResult(
            true,
            authority,
            $"https://sandbox.zarinpal.com/pg/StartPay/{authority}",
            null);
    }

    public async Task<PaymentVerificationResult> VerifyPaymentAsync(
        Guid orderId,
        string authority)
    {
        var merchantId =
            _configuration["Zarinpal:MerchantId"];

        return new PaymentVerificationResult(
            false,
            null,
            "Zarinpal verification will be connected after the callback flow.");
    }

    private class ZarinpalRequestResponse
    {
        public ZarinpalData? Data { get; set; }
    }

    private class ZarinpalData
    {
        public int Code { get; set; }

        public string? Authority { get; set; }
    }
}