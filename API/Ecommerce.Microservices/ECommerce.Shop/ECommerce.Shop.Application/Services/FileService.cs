using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ECommerce.Common.Application.Services;
using ECommerce.Common.CrossCuttingConcerns.Extensions;
using ECommerce.Common.Domain.Entities.Media;
using ECommerce.Common.Domain.Enum;
using ECommerce.Common.Domain.IRepositories;
using ECommerce.Shop.Application.ConfigurationOptions;
using ECommerce.Shop.Domain.DTOs.Media;
using ECommerce.Shop.Domain.IService;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shop.Application.Services;

public class FileService : BaseService<FileService>, IFileService
{
    private readonly AppSettingConfiguration _appSetting = new();

    public FileService(IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<FileService> logger) : base(configuration, unitOfWork, logger)
    {
        configuration.Bind(_appSetting);
    }

    public async Task<FileListResponseDto> GetFileListAsync(FileFilterParamsDto searchDto)
    {
        var query = _unitOfWork.Repository<Files>()
            .Where(x => x.Status != FileStatus.Deleted)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.Keyword))
        {
            query = query.Where(x => x.FileName.Contains(searchDto.Keyword.Trim()));
        }

        if (searchDto.DateFrom.HasValue)
            query = query.Where(x => searchDto.DateFrom.Value <= x.CreatedDate);

        if (searchDto.DateTo.HasValue)
            query = query.Where(x => searchDto.DateTo.Value >= x.CreatedDate);

        if (searchDto.Status.HasValue)
        {
            query = query.Where(x => x.Status == (FileStatus)searchDto.Status.Value);
        }

        query = searchDto.SortName switch
        {
            "title" => query.OrderByIf(x => x.FileName, searchDto.IsAscending ?? true),
            _ => query.OrderByDescending(x => x.CreatedDate)
        };

        var fileListFromDb = await query.ToListAsync();
        // var fileList = fileListFromDb.Skip((searchDto.PageNumber - 1) * searchDto.PageSize).Take(searchDto.PageSize);

        var baseUri = GetBaseUri();
        if (baseUri == null)
        {
            return null;
        }

        var total = await query.CountAsync();
        var fileInListResponse = fileListFromDb.Select(x =>
            new FileInListResponseDto()
            {
                Id = x.Id,
                FileName = x.FileName,
                SeoFilename = x.SeoFilename,
                AltAttribute = x.AltAttribute,
                Size = x.Size,
                FileType = x.FileType,
                Status = x.Status,
                TitleAttribute = x.TitleAttribute,
                ThumbnailUrl = new Uri(baseUri, x.VirtualPath).ToString()
            }
        ).ToList();

        var result = new FileListResponseDto
        {
            Data = fileInListResponse,
            Total = total
        };
        return result;
    }

    public async Task<FileInListResponseDto> SaveFileInformation(FileInformationDto file)
    {
        var fileName = file.FileName.Split('.')[0];
        var entity = new Files
        {
            Id = Guid.NewGuid(),
            FileName = fileName,
            SeoFilename = fileName,
            Size = file.Size,
            FileType = file.FileType,
            VirtualPath = file.VirtualPath,
            Status = FileStatus.Active
        };

        await _unitOfWork.Repository<Files>().AddAsync(entity);
        await _unitOfWork.SaveChangesAsync();

        var baseUri = GetBaseUri();
        if (baseUri == null)
        {
            return null;
        }

        return new FileInListResponseDto
        {
            Id = entity.Id,
            FileName = entity.FileName,
            SeoFilename = entity.SeoFilename,
            AltAttribute = entity.AltAttribute,
            Size = entity.Size,
            FileType = entity.FileType,
            Status = entity.Status,
            TitleAttribute = entity.TitleAttribute,
            ThumbnailUrl = new Uri(baseUri, entity.VirtualPath).ToString()
        };
    }

    private Uri GetBaseUri()
    {
        var isCreateUriSuccess = Uri.TryCreate(_appSetting.AppDomain, UriKind.Absolute, out var baseUri);
        return !isCreateUriSuccess ? null : baseUri;
    }
}