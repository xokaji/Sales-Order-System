namespace SalesOrderApp.Application.Interfaces;

using SalesOrderApp.Domain.Entities;

public interface ISalesOrderRepository : IRepository<SalesOrder>
{
    Task<SalesOrder?> GetByIdWithLinesAsync(int id, CancellationToken ct = default);

    Task<(List<SalesOrder> Items, int TotalCount)> GetPagedAsync(
        int pageNumber, int pageSize, string? sortBy, bool descending, CancellationToken ct = default);

    Task<bool> InvoiceNoExistsAsync(string invoiceNo, int? excludeId, CancellationToken ct = default);
    Task<string> GenerateNextInvoiceNoAsync(CancellationToken ct = default);
}
