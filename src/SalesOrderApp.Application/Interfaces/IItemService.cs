namespace SalesOrderApp.Application.Interfaces;

using SalesOrderApp.Application.DTOs;

public interface IItemService
{
    Task<List<ItemDto>> GetAllAsync(string? search, CancellationToken ct = default);
    Task<ItemDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ItemDto?> GetByCodeAsync(string itemCode, CancellationToken ct = default);
    Task<ItemDto> CreateAsync(CreateItemDto dto, CancellationToken ct = default);
}
