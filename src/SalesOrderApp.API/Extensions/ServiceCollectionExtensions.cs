namespace SalesOrderApp.API.Extensions;

using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Application.Mappings;
using SalesOrderApp.Application.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));

        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<ISalesOrderService, SalesOrderService>();

        return services;
    }
}
