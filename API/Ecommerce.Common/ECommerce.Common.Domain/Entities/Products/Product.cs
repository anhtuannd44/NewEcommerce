using System.ComponentModel.DataAnnotations.Schema;
using ECommerce.Common.Domain.Entities.Identity;
using ECommerce.Common.Domain.Entities.Media;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Products;

public class Product : AbstractEntity
{
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string Body { get; set; }
    public string MetaKeywords { get; set; }
    public string MetaDescription { get; set; }
    public string MetaTitle { get; set; }
    public string SeoUrl { get; set; }
    public string Unit { get; set; }
    public string Tags { get; set; }
    public bool AllowCustomerReviews { get; set; }
    public bool AllowComments { get; set; }
    public string Sku { get; set; }
    public string BarCode { get; set; }
    public bool ManageStockQuantity { get; set; }
    public int? StockQuantity { get; set; }
    public bool CallForPrice { get; set; }
    public decimal? Price { get; set; }
    public decimal? ProductCost { get; set; }
    public ProductStatus Status { get; set; }
    public ProductType ProductType { get; set; }
    public Guid? FileId { get; set; }
    public Guid? BrandId { get; set; }
    public Guid? ProductCategoryId { get; set; }

    [ForeignKey("FileId")]
    public virtual Files MainPicture { get; set; }
    public virtual ProductCategory ProductCategory { get; set; }
    public virtual Brand Brand { get; set; }
    public virtual IList<ProductAttribute> ProductAttributes { get; set; }
    public virtual IList<ProductAttributeCombination> ProductAttributeCombinations { get; set; }
    public virtual IList<ProductFilesMapping> ProductFilesMappings { get; set; }
}