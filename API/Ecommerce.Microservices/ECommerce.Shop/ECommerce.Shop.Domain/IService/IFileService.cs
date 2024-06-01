using ECommerce.Shop.Domain.DTOs.Media;

namespace ECommerce.Shop.Domain.IService;

public interface IFileService
{
    /// <summary>
    /// Get file list with filtering
    /// </summary>
    /// <param name="searchDto">The dto for filtering</param>
    /// <returns>The File List</returns>
    Task<FileListResponseDto> GetFileListAsync(FileFilterParamsDto searchDto);

    /// <summary>
    /// Save the information file to database
    /// </summary>
    /// <param name="file">The file information</param>
    /// <returns>The file response</returns>
    Task<FileInListResponseDto> SaveFileInformation(FileInformationDto file);
}