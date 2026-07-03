namespace SalesOrderApp.Application.Services;

using AutoMapper;
using SalesOrderApp.Application.Common;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

public class CustomerService : ICustomerService
{
    private readonly IRepository<Customer> _repository;
    private readonly IMapper _mapper;

    public CustomerService(IRepository<Customer> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<CustomerDto>> GetAllAsync(string? search, CancellationToken ct = default)
    {
        var customers = await _repository.GetAllAsync(ct);

        if (!string.IsNullOrWhiteSpace(search))
        {
            customers = customers
                .Where(c => c.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return _mapper.Map<List<CustomerDto>>(customers.OrderBy(c => c.Name));
    }

    public async Task<CustomerDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var customer = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Customer), id);

        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto, CancellationToken ct = default)
    {
        var entity = _mapper.Map<Customer>(dto);
        await _repository.AddAsync(entity, ct);
        await _repository.SaveChangesAsync(ct);
        return _mapper.Map<CustomerDto>(entity);
    }
}
