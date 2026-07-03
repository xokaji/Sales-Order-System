namespace SalesOrderApp.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalesOrderApp.Domain.Entities;

public class SalesOrderLineConfiguration : IEntityTypeConfiguration<SalesOrderLine>
{
    public void Configure(EntityTypeBuilder<SalesOrderLine> builder)
    {
        builder.ToTable("SalesOrderLines");
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Description).IsRequired().HasMaxLength(300);
        builder.Property(l => l.Note).HasMaxLength(500);

        builder.Property(l => l.Quantity).HasColumnType("decimal(18,3)");
        builder.Property(l => l.Price).HasColumnType("decimal(18,2)");
        builder.Property(l => l.TaxRate).HasColumnType("decimal(5,4)");
        builder.Property(l => l.ExclAmount).HasColumnType("decimal(18,2)");
        builder.Property(l => l.TaxAmount).HasColumnType("decimal(18,2)");
        builder.Property(l => l.InclAmount).HasColumnType("decimal(18,2)");

        builder.HasOne(l => l.Item)
            .WithMany(i => i.SalesOrderLines)
            .HasForeignKey(l => l.ItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
