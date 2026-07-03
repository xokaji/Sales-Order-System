namespace SalesOrderApp.Domain.Entities;

using SalesOrderApp.Domain.Common;

public class SalesOrder : BaseEntity
{
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow.Date;
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public ICollection<SalesOrderLine> Lines { get; set; } = new List<SalesOrderLine>();
}
