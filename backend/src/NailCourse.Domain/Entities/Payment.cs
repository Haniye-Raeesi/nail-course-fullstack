namespace NailCourse.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public decimal Amount { get; set; }

    public string? Authority { get; set; }

    public string? ReferenceId { get; set; }

    public bool IsSuccessful { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public Order Order { get; set; } = null!;
}