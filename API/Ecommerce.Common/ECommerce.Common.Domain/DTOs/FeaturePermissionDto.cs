namespace ECommerce.Common.Domain.DTOs;

public class FeaturePermissionDto
{
    public string FeatureName { get; set; }
    public bool CanCreate { get; set; }
    public bool CanReadOnly { get; set; }
    public bool CanUpdate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanApprove { get; set; }
}