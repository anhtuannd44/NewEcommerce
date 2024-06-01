using ECommerce.Common.Domain.Entities.Products;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Common.Domain.Entities.Media;

/// <summary>
/// Represents a file
/// </summary>
public class Files : AbstractEntity
{
    /// <summary>
    /// Gets or sets the file name
    /// </summary>
    public string FileName { get; set; }

    /// <summary>
    /// Gets or sets the SEO friendly filename of the picture
    /// </summary>
    public string SeoFilename { get; set; }

    /// <summary>
    /// Gets or sets the "alt" attribute for "img" HTML element. If empty, then a default rule will be used (e.g. product name)
    /// </summary>
    public string AltAttribute { get; set; }
    
    /// <summary>
    /// Gets or sets the file size
    /// </summary>
    public long Size { get; set; }
    
    /// <summary>
    /// Gets or sets the file size
    /// </summary>
    public string FileType { get; set; }

    /// <summary>
    /// Gets or sets the "title" attribute for "img" HTML element. If empty, then a default rule will be used (e.g. product name)
    /// </summary>
    public string TitleAttribute { get; set; }

    /// <summary>
    /// Gets or sets the picture virtual path
    /// </summary>
    public string VirtualPath { get; set; }
    
    /// <summary>
    /// Gets or sets the file status
    /// </summary>
    public FileStatus Status { get; set; }
    
    public virtual IList<ProductFilesMapping> ProductFilesMappings { get; set; }
}