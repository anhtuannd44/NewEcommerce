﻿// <auto-generated />
using System;
using ECommerce.AuditLog.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ECommerce.AuditLog.Api.Migrations.AuditLogDb;

[DbContext(typeof(AuditLogDbContext))]
partial class AuditLogDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.0")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("ClassifiedAds.Services.AuditLog.Entities.AuditLogEntry", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("uniqueidentifier")
                .HasDefaultValueSql("newsequentialid()");

            b.Property<string>("Action")
                .IsRequired()
                .HasColumnType("nvarchar(max)");

            b.Property<DateTimeOffset>("CreatedDateTime")
                .HasColumnType("datetimeoffset");

            b.Property<string>("Log")
                .IsRequired()
                .HasColumnType("nvarchar(max)");

            b.Property<string>("ObjectId")
                .IsRequired()
                .HasColumnType("nvarchar(max)");

            b.Property<byte[]>("RowVersion")
                .IsConcurrencyToken()
                .ValueGeneratedOnAddOrUpdate()
                .HasColumnType("rowversion");

            b.Property<DateTimeOffset?>("UpdatedDateTime")
                .HasColumnType("datetimeoffset");

            b.Property<Guid>("UserId")
                .HasColumnType("uniqueidentifier");

            b.HasKey("Id");

            b.ToTable("AuditLogEntries", (string)null);
        });

        modelBuilder.Entity("ClassifiedAds.Services.AuditLog.Entities.IdempotentRequest", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("uniqueidentifier")
                .HasDefaultValueSql("newsequentialid()");

            b.Property<DateTimeOffset>("CreatedDateTime")
                .HasColumnType("datetimeoffset");

            b.Property<string>("RequestId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.Property<string>("RequestType")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.Property<byte[]>("RowVersion")
                .IsConcurrencyToken()
                .ValueGeneratedOnAddOrUpdate()
                .HasColumnType("rowversion");

            b.Property<DateTimeOffset?>("UpdatedDateTime")
                .HasColumnType("datetimeoffset");

            b.HasKey("Id");

            b.HasIndex("RequestType", "RequestId")
                .IsUnique();

            b.ToTable("IdempotentRequests", (string)null);
        });
#pragma warning restore 612, 618
    }
}