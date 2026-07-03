namespace SalesOrderApp.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Persistence;

public class SalesOrderRepository : Repository<SalesOrder>, ISalesOrderRepository
{
    public SalesOrderRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<SalesOrder?> GetByIdWithLinesAsync(int id, CancellationToken ct = default) =>
        await Context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<(List<SalesOrder> Items, int TotalCount)> GetPagedAsync(
        int pageNumber, int pageSize, string? sortBy, bool descending, CancellationToken ct = default)
    {
        var query = Context.SalesOrders
            .Include(o => o.Customer)
            .AsNoTracking()
            .AsQueryable();

        query = (sortBy?.ToLowerInvariant()) switch
        {
            "invoiceno" => descending ? query.OrderByDescending(o => o.InvoiceNo) : query.OrderBy(o => o.InvoiceNo),
            "customername" => descending ? query.OrderByDescending(o => o.Customer.Name) : query.OrderBy(o => o.Customer.Name),
            "referenceno" => descending ? query.OrderByDescending(o => o.ReferenceNo) : query.OrderBy(o => o.ReferenceNo),
            "totalexcl" => descending ? query.OrderByDescending(o => o.TotalExcl) : query.OrderBy(o => o.TotalExcl),
            "totaltax" => descending ? query.OrderByDescending(o => o.TotalTax) : query.OrderBy(o => o.TotalTax),
            "totalincl" => descending ? query.OrderByDescending(o => o.TotalIncl) : query.OrderBy(o => o.TotalIncl),
            _ => descending ? query.OrderByDescending(o => o.InvoiceDate) : query.OrderBy(o => o.InvoiceDate),
        };

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<bool> InvoiceNoExistsAsync(string invoiceNo, int? excludeId, CancellationToken ct = default) =>
        await Context.SalesOrders.AnyAsync(o =>
            o.InvoiceNo == invoiceNo && (excludeId == null || o.Id != excludeId), ct);

    public async Task<string> GenerateNextInvoiceNoAsync(CancellationToken ct = default)
    {
        var lastNumber = await Context.SalesOrders
            .OrderByDescending(o => o.Id)
            .Select(o => o.InvoiceNo)
            .FirstOrDefaultAsync(ct);

        var nextSeq = 1;
        if (!string.IsNullOrEmpty(lastNumber) && lastNumber.StartsWith("INV-") &&
            int.TryParse(lastNumber.AsSpan(4), out var parsed))
        {
            nextSeq = parsed + 1;
        }

        return $"INV-{nextSeq:D6}";
    }
}
