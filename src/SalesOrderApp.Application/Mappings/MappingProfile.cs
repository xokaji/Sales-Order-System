namespace SalesOrderApp.Application.Mappings;

using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>();
        CreateMap<CreateCustomerDto, Customer>();

        CreateMap<Item, ItemDto>();
        CreateMap<CreateItemDto, Item>();

        CreateMap<SalesOrder, SalesOrderListItemDto>()
            .ForMember(d => d.CustomerName, o => o.MapFrom(s => s.Customer.Name));

        CreateMap<SalesOrder, SalesOrderDto>()
            .ForMember(d => d.CustomerName, o => o.MapFrom(s => s.Customer.Name))
            .ForMember(d => d.Address1, o => o.MapFrom(s => s.Customer.Address1))
            .ForMember(d => d.Address2, o => o.MapFrom(s => s.Customer.Address2))
            .ForMember(d => d.Address3, o => o.MapFrom(s => s.Customer.Address3))
            .ForMember(d => d.Suburb, o => o.MapFrom(s => s.Customer.Suburb))
            .ForMember(d => d.State, o => o.MapFrom(s => s.Customer.State))
            .ForMember(d => d.PostCode, o => o.MapFrom(s => s.Customer.PostCode))
            .ForMember(d => d.Lines, o => o.MapFrom(s => s.Lines));

        CreateMap<SalesOrderLine, SalesOrderLineDto>()
            .ForMember(d => d.ItemCode, o => o.MapFrom(s => s.Item.ItemCode));
    }
}
