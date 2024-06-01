namespace ECommerce.Shop.Domain.DTOs.Media
{
    public class UploadFilesDto
    {
        public string FileName { get; set; }
        public string SeoFilename { get; set; }
        public string AltAttribute { get; set; }
        public string Size { get; set; }
        public string FileType { get; set; }
        public string TitleAttribute { get; set; }
        public string VirtualPath { get; set; }
    }
}