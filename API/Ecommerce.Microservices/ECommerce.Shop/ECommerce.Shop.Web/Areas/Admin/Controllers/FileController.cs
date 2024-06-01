using ECommerce.Common.CrossCuttingConcerns;
using ECommerce.Common.Domain.Identity;
using ECommerce.Shop.Domain.DTOs;
using ECommerce.Shop.Domain.DTOs.Media;
using ECommerce.Shop.Domain.IService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Shop.Web.Areas.Admin.Controllers;

[Route("api/admin/[controller]")]
public class FileController : AdminBaseController
{
    private readonly IFileService _fileService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileController(IFileService fileService,
        IWebHostEnvironment webHostEnvironment,
        ICurrentUser currentUser,
        IConfiguration configuration,
        ILogger<FileController> logger) : base(configuration, logger, currentUser)
    {
        _fileService = fileService;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet]
    [Route("")]
    public async Task<IActionResult> GetFileListAsync([FromQuery] FileFilterParamsDto searchDto)
    {
        _logger.LogInformation("Start getting file list - GetFileManagerListAsync");
        try
        {
            var result = await _fileService.GetFileListAsync(searchDto);
            _logger.LogInformation("Start getting file list - GetFileManagerListAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(GetFileListAsync)} failed: ");
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> UploadFilesAsync()
    {
        _logger.LogInformation("Start getting file list - UploadFilesAsync");
        try
        {
            if (Request.Form.Files.Count == 0)
            {
                return BadRequest();
            }

            var file = Request.Form.Files[0];
            var rootPath = _webHostEnvironment.ContentRootPath;
            var baseFolder = _appSettings.FileDirectory.BaseFolderName;

            try
            {
                var filePath = Path.Combine(rootPath, baseFolder, file.FileName);
                if (Path.Exists(filePath))
                {
                    return BadRequest(new BadRequestResponseDto(ECommerceConstants.FileExisted, string.Format(ECommerceConstants.FileExistedMessage, file.FileName)));
                }

                await using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Upload File Error: ");
                return BadRequest();
            }

            var relativePath = Path.Combine(baseFolder, file.FileName);
            var fileInformation = new FileInformationDto
            {
                FileName = file.FileName,
                FileType = file.ContentType,
                VirtualPath = relativePath,
                Size = file.Length
            };

            var result = await _fileService.SaveFileInformation(fileInformation);
            _logger.LogInformation("Start getting file list - UploadFilesAsync");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{nameof(UploadFilesAsync)} failed: ");
            return BadRequest();
        }
    }
}