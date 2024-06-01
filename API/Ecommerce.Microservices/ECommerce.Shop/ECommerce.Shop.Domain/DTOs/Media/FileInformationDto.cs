namespace ECommerce.Shop.Domain.DTOs.Media;

public class FileInformationDto
{
    public string FileName { get; set; }
    public long Size { get; set; }
    public string FileType { get; set; }
    public string VirtualPath { get; set; }
}