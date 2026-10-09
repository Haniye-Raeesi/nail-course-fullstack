using NailCourse.Domain.Entities;

namespace NailCourse.Application.Services;

public interface IOrderCompletionService
{
    Task CompletePaidOrderAsync(Order order);
}