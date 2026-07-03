namespace SalesOrderApp.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalesOrderApp.Domain.Entities;

public class SalesOrderConfiguration : IEntityTypeConfiguration<SalesOrder>
{
    public void Configure(EntityTypeBuilder<SalesOrder> builder)
    {
        builder.ToTable("SalesOrders");
        builder.HasKey(o => o.Id);

        builder.Property(o => o.InvoiceNo).IsRequired().HasMaxLength(30);
        builder.Property(o => o.ReferenceNo).HasMaxLength(100);
        builder.Property(o => o.Note).HasMaxLength(1000);

        builder.Property(o => o.TotalExcl).HasColumnType("decimal(18,2)");
        builder.Property(o => o.TotalTax).HasColumnType("decimal(18,2)");
        builder.Property(o => o.TotalIncl).HasColumnType("decimal(18,2)");

        builder.HasIndex(o => o.InvoiceNo).IsUnique();

        builder.HasOne(o => o.Customer)
            .WithMany(c => c.SalesOrders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Lines)
            .WithOne(l => l.SalesOrder)
            .HasForeignKey(l => l.SalesOrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
