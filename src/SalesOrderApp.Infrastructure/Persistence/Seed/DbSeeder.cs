namespace SalesOrderApp.Infrastructure.Persistence.Seed;

using SalesOrderApp.Domain.Entities;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.Customers.Any())
        {
            context.Customers.AddRange(
                new Customer
                {
                    Name = "Lanka Traders (Pvt) Ltd",
                    Address1 = "125 Galle Road",
                    Address2 = "Bambalapitiya",
                    Address3 = "Colombo District",
                    Suburb = "Colombo 04",
                    State = "Western Province",
                    PostCode = "00400"
                },
                new Customer
                {
                    Name = "Kandy Wholesale Suppliers",
                    Address1 = "78 Peradeniya Road",
                    Address2 = "Getambe",
                    Address3 = "Kandy District",
                    Suburb = "Kandy",
                    State = "Central Province",
                    PostCode = "20000"
                },
                new Customer
                {
                    Name = "Southern Spice Distributors",
                    Address1 = "42 Matara Road",
                    Address2 = "Nupe",
                    Address3 = "Matara District",
                    Suburb = "Matara",
                    State = "Southern Province",
                    PostCode = "81000"
                },
                new Customer
                {
                    Name = "Jaffna Agro Products",
                    Address1 = "15 Hospital Road",
                    Address2 = "Nallur",
                    Address3 = "Jaffna District",
                    Suburb = "Jaffna",
                    State = "Northern Province",
                    PostCode = "40000"
                },
                new Customer
                {
                    Name = "Kurunegala Food Mart",
                    Address1 = "210 Colombo Road",
                    Address2 = "Malkaduwawa",
                    Address3 = "Kurunegala District",
                    Suburb = "Kurunegala",
                    State = "North Western Province",
                    PostCode = "60000"
                }
            );
        }

        if (!context.Items.Any())
        {
            context.Items.AddRange(
                new Item { ItemCode = "ITM-001", Description = "A4 Copy Paper (Ream)", Price = 6.50m, TaxRate = 0.10m },
                new Item { ItemCode = "ITM-002", Description = "Wireless Keyboard", Price = 45.00m, TaxRate = 0.10m },
                new Item { ItemCode = "ITM-003", Description = "USB-C Docking Station", Price = 129.00m, TaxRate = 0.10m },
                new Item { ItemCode = "ITM-004", Description = "Office Chair - Ergonomic", Price = 249.00m, TaxRate = 0.10m },
                new Item { ItemCode = "ITM-005", Description = "Laptop Stand - Aluminium", Price = 39.90m, TaxRate = 0.10m }
            );
        }

        await context.SaveChangesAsync();
    }
}
