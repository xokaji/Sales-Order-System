namespace SalesOrderApp.Application.Interfaces;

using SalesOrderApp.Application.Common;
using SalesOrderApp.Application.DTOs;

public interface ISalesOrderService
{
    Task<PagedResult<SalesOrderListItemDto>> GetListAsync(
        int pageNumber, int pageSize, string? sortBy, bool descending, CancellationToken ct = default);

    Task<SalesOrderDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<SalesOrderDto> CreateAsync(UpsertSalesOrderDto dto, CancellationToken ct = default);
    Task<SalesOrderDto> UpdateAsync(int id, UpsertSalesOrderDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
