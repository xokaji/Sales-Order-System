namespace SalesOrderApp.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalesOrderApp.Domain.Entities;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.ToTable("Items");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.ItemCode).IsRequired().HasMaxLength(50);
        builder.Property(i => i.Description).IsRequired().HasMaxLength(300);
        builder.Property(i => i.Price).HasColumnType("decimal(18,2)");
        builder.Property(i => i.TaxRate).HasColumnType("decimal(5,4)");

        builder.HasIndex(i => i.ItemCode).IsUnique();
    }
}
