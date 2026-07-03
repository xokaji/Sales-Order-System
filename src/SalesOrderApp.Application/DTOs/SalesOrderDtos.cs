namespace SalesOrderApp.Application.DTOs;

public class SalesOrderListItemDto
{
    public int Id { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? ReferenceNo { get; set; }
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
}

public class SalesOrderDto
{
    public int Id { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? Address3 { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? PostCode { get; set; }

    public List<SalesOrderLineDto> Lines { get; set; } = new();

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
}

public class SalesOrderLineDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}


public class UpsertSalesOrderDto
{
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow.Date;
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public int CustomerId { get; set; }
    public List<UpsertSalesOrderLineDto> Lines { get; set; } = new();
}

public class UpsertSalesOrderLineDto
{
    public int? Id { get; set; }
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal? PriceOverride { get; set; }
}
