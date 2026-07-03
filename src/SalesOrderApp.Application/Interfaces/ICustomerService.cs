namespace SalesOrderApp.Application.Interfaces;

using SalesOrderApp.Application.DTOs;

public interface ICustomerService
{
    Task<List<CustomerDto>> GetAllAsync(string? search, CancellationToken ct = default);
    Task<CustomerDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<CustomerDto> CreateAsync(CreateCustomerDto dto, CancellationToken ct = default);
}
