namespace SalesOrderApp.Application.Services;

using AutoMapper;
using SalesOrderApp.Application.Common;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _salesOrderRepository;
    private readonly IRepository<Customer> _customerRepository;
    private readonly IRepository<Item> _itemRepository;
    private readonly IMapper _mapper;

    public SalesOrderService(
        ISalesOrderRepository salesOrderRepository,
        IRepository<Customer> customerRepository,
        IRepository<Item> itemRepository,
        IMapper mapper)
    {
        _salesOrderRepository = salesOrderRepository;
        _customerRepository = customerRepository;
        _itemRepository = itemRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<SalesOrderListItemDto>> GetListAsync(
        int pageNumber, int pageSize, string? sortBy, bool descending, CancellationToken ct = default)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize is < 1 or > 200 ? 20 : pageSize;

        var (items, totalCount) = await _salesOrderRepository.GetPagedAsync(
            pageNumber, pageSize, sortBy, descending, ct);

        return new PagedResult<SalesOrderListItemDto>
        {
            Items = _mapper.Map<List<SalesOrderListItemDto>>(items),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<SalesOrderDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var order = await _salesOrderRepository.GetByIdWithLinesAsync(id, ct)
            ?? throw new NotFoundException(nameof(SalesOrder), id);

        return _mapper.Map<SalesOrderDto>(order);
    }

    public async Task<SalesOrderDto> CreateAsync(UpsertSalesOrderDto dto, CancellationToken ct = default)
    {
        await ValidateAsync(dto, existingOrderId: null, ct);

        var order = new SalesOrder
        {
            InvoiceNo = await _salesOrderRepository.GenerateNextInvoiceNoAsync(ct),
            InvoiceDate = dto.InvoiceDate,
            ReferenceNo = dto.ReferenceNo,
            Note = dto.Note,
            CustomerId = dto.CustomerId,
        };

        await BuildLinesAsync(order, dto.Lines, ct);
        ApplyTotals(order);

        await _salesOrderRepository.AddAsync(order, ct);
        await _salesOrderRepository.SaveChangesAsync(ct);

        var created = await _salesOrderRepository.GetByIdWithLinesAsync(order.Id, ct);
        return _mapper.Map<SalesOrderDto>(created);
    }

    public async Task<SalesOrderDto> UpdateAsync(int id, UpsertSalesOrderDto dto, CancellationToken ct = default)
    {
        await ValidateAsync(dto, existingOrderId: id, ct);

        var order = await _salesOrderRepository.GetByIdWithLinesAsync(id, ct)
            ?? throw new NotFoundException(nameof(SalesOrder), id);

        order.InvoiceDate = dto.InvoiceDate;
        order.ReferenceNo = dto.ReferenceNo;
        order.Note = dto.Note;
        order.CustomerId = dto.CustomerId;
        order.UpdatedAtUtc = DateTime.UtcNow;

        order.Lines.Clear();
        await BuildLinesAsync(order, dto.Lines, ct);
        ApplyTotals(order);

        _salesOrderRepository.Update(order);
        await _salesOrderRepository.SaveChangesAsync(ct);

        var updated = await _salesOrderRepository.GetByIdWithLinesAsync(id, ct);
        return _mapper.Map<SalesOrderDto>(updated);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var order = await _salesOrderRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(SalesOrder), id);

        _salesOrderRepository.Remove(order);
        await _salesOrderRepository.SaveChangesAsync(ct);
    }

    private async Task ValidateAsync(UpsertSalesOrderDto dto, int? existingOrderId, CancellationToken ct)
    {
        if (await _customerRepository.GetByIdAsync(dto.CustomerId, ct) is null)
            throw new BusinessRuleException($"Customer {dto.CustomerId} does not exist.");

        if (dto.Lines is null || dto.Lines.Count == 0)
            throw new BusinessRuleException("A sales order must have at least one line item.");

        foreach (var line in dto.Lines)
        {
            if (line.Quantity <= 0)
                throw new BusinessRuleException("Line quantity must be greater than zero.");

            if (await _itemRepository.GetByIdAsync(line.ItemId, ct) is null)
                throw new BusinessRuleException($"Item {line.ItemId} does not exist.");
        }
    }

    private async Task BuildLinesAsync(SalesOrder order, List<UpsertSalesOrderLineDto> lineDtos, CancellationToken ct)
    {
        foreach (var lineDto in lineDtos)
        {
            var item = await _itemRepository.GetByIdAsync(lineDto.ItemId, ct)
                ?? throw new NotFoundException(nameof(Item), lineDto.ItemId);

            var price = lineDto.PriceOverride ?? item.Price;
            var exclAmount = Math.Round(lineDto.Quantity * price, 2, MidpointRounding.AwayFromZero);
            var taxAmount = Math.Round(exclAmount * item.TaxRate, 2, MidpointRounding.AwayFromZero);

            order.Lines.Add(new SalesOrderLine
            {
                ItemId = item.Id,
                Description = item.Description,
                Note = lineDto.Note,
                Quantity = lineDto.Quantity,
                Price = price,
                TaxRate = item.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = exclAmount + taxAmount,
            });
        }
    }

    private static void ApplyTotals(SalesOrder order)
    {
        order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
        order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
        order.TotalIncl = order.Lines.Sum(l => l.InclAmount);
    }
}
