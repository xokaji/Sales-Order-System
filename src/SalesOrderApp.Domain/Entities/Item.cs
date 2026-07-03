namespace SalesOrderApp.Domain.Entities;

using SalesOrderApp.Domain.Common;


public class Item : BaseEntity
{
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public decimal TaxRate { get; set; }

    public ICollection<SalesOrderLine> SalesOrderLines { get; set; } = new List<SalesOrderLine>();
}
