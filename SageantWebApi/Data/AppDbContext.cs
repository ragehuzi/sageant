using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SageantWebApi.Data.Entities;

namespace SageantWebApi.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Organisation> Organisations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("pgcrypto");

        modelBuilder.Entity<Organisation>(entity =>
        {
            entity.HasKey(e => e.OrgId).HasName("organisations_pkey");

            entity.ToTable("organisations");

            entity.Property(e => e.OrgId).HasColumnName("org_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .HasDefaultValueSql("'PKR'::bpchar")
                .IsFixedLength()
                .HasColumnName("currency");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.LogoStorageKey)
                .HasMaxLength(800)
                .HasColumnName("logo_storage_key");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .HasColumnName("name");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Timezone)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Asia/Karachi'::character varying")
                .HasColumnName("timezone");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Website)
                .HasMaxLength(255)
                .HasColumnName("website");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
