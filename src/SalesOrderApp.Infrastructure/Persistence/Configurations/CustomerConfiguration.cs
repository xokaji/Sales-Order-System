namespace SalesOrderApp.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalesOrderApp.Domain.Entities;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Address1).HasMaxLength(200);
        builder.Property(c => c.Address2).HasMaxLength(200);
        builder.Property(c => c.Address3).HasMaxLength(200);
        builder.Property(c => c.Suburb).HasMaxLength(100);
        builder.Property(c => c.State).HasMaxLength(100);
        builder.Property(c => c.PostCode).HasMaxLength(20);

        builder.HasIndex(c => c.Name);
    }
}
