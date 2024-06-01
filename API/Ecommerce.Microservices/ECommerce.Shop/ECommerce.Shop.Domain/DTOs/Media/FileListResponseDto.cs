using System.Text.Json.Serialization;
using ECommerce.Common.Domain.Enum;

namespace ECommerce.Shop.Domain.DTOs.Media;

public class FileListResponseDto
{
    public List<FileInListResponseDto> Data { get; set; }
    public int Total { get; set; }
}

public class FileInListResponseDto
{
    [JsonPropertyName("_id")]
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public string SeoFilename { get; set; }
    public string AltAttribute { get; set; }
    public long Size { get; set; }
    public string FileType { get; set; }
    public string TitleAttribute { get; set; }
    
    [JsonPropertyName("thumbnailUrl")]
    public string ThumbnailUrl { get; set; }
    public FileStatus Status { get; set; }
}