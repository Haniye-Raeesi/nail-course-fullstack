using NailCourse.Domain.Enums;
namespace NailCourse.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}