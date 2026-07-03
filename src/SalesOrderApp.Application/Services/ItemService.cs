namespace SalesOrderApp.Application.Services;

using AutoMapper;
using SalesOrderApp.Application.Common;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

public class ItemService : IItemService
{
    private readonly IRepository<Item> _repository;
    private readonly IMapper _mapper;

    public ItemService(IRepository<Item> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<ItemDto>> GetAllAsync(string? search, CancellationToken ct = default)
    {
        var items = await _repository.GetAllAsync(ct);

        if (!string.IsNullOrWhiteSpace(search))
        {
            items = items.Where(i =>
                    i.ItemCode.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    i.Description.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return _mapper.Map<List<ItemDto>>(items.OrderBy(i => i.ItemCode));
    }

    public async Task<ItemDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var item = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Item), id);

        return _mapper.Map<ItemDto>(item);
    }

    public async Task<ItemDto?> GetByCodeAsync(string itemCode, CancellationToken ct = default)
    {
        var items = await _repository.GetAllAsync(ct);
        var item = items.FirstOrDefault(i => i.ItemCode.Equals(itemCode, StringComparison.OrdinalIgnoreCase));
        return item is null ? null : _mapper.Map<ItemDto>(item);
    }

    public async Task<ItemDto> CreateAsync(CreateItemDto dto, CancellationToken ct = default)
    {
        var entity = _mapper.Map<Item>(dto);
        await _repository.AddAsync(entity, ct);
        await _repository.SaveChangesAsync(ct);
        return _mapper.Map<ItemDto>(entity);
    }
}
