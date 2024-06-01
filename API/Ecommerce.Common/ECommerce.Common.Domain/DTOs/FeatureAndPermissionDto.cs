namespace ECommerce.Common.Domain.DTOs;

public class FeatureAndPermissionDto
{
    public string FeatureCode { get; set; }
    public string FeatureCodeVi { get; set; }
    public List<string> Permissions { get; set; }
}