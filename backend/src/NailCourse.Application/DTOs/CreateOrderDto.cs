namespace NailCourse.Application.DTOs;

public class CreateOrderDto
{
    public List<Guid> CourseIds { get; set; } = new();
}