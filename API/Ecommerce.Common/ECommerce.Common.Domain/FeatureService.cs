using ECommerce.Common.Domain.DTOs;

namespace ECommerce.Common.Domain;

public static class FeatureService
{
    public static IEnumerable<FeatureAndPermissionDto> AllValidPermissionPerFeature
    {
        get
        {
            yield return new FeatureAndPermissionDto
            {
                FeatureCode = PermissionClaimTypes.ManageUser,
                FeatureCodeVi = PermissionClaimTypes.ManageUserVi,
                Permissions =
                [
                    PermissionClaimTypes.CanReadUser,
                    PermissionClaimTypes.CanCreateUser,
                    PermissionClaimTypes.CanUpdateUser,
                    PermissionClaimTypes.CanDeleteUser,
                    PermissionClaimTypes.CanApproveUser
                ]
            };
            yield return new FeatureAndPermissionDto
            {
                FeatureCode = PermissionClaimTypes.ManageRole,
                FeatureCodeVi = PermissionClaimTypes.ManageRoleVi,
                Permissions =
                [
                    PermissionClaimTypes.CanReadRole,
                    PermissionClaimTypes.CanCreateRole,
                    PermissionClaimTypes.CanUpdateRole,
                    PermissionClaimTypes.CanDeleteRole,
                    PermissionClaimTypes.CanApproveRole
                ]
            };
            yield return new FeatureAndPermissionDto
            {
                FeatureCode = PermissionClaimTypes.ManageUserRole,
                FeatureCodeVi = PermissionClaimTypes.ManageUserRoleVi,
                Permissions =
                [
                    PermissionClaimTypes.CanReadUserRole,
                    PermissionClaimTypes.CanCreateUserRole,
                    PermissionClaimTypes.CanUpdateUserRole,
                    PermissionClaimTypes.CanDeleteUserRole,
                    PermissionClaimTypes.CanApproveUserRole
                ]
            };
            yield return new FeatureAndPermissionDto
            {
                FeatureCode = PermissionClaimTypes.ManageBlog,
                FeatureCodeVi = PermissionClaimTypes.ManageBlogVi,
                Permissions =
                [
                    PermissionClaimTypes.CanReadBlog,
                    PermissionClaimTypes.CanCreateBlog,
                    PermissionClaimTypes.CanUpdateBlog,
                    PermissionClaimTypes.CanDeleteBlog,
                    PermissionClaimTypes.CanApproveBlog
                ]
            };
        }
    }
}