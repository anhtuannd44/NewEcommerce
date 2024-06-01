namespace ECommerce.Common.CrossCuttingConcerns;

public class ECommerceConstants
{
    public const string LoginTypePassword = "password";
    public const string LoginTypeRefreshToken = "refresh_token";
    // User exists
    public const string UnsupportedGrantType = "unsupported_grant_type";
    public const string LoginError = "login_error";

    public const string LoginSuccessfullyMessage = "Login Successfully";
    public const string UserAlertExist = "User already exists.";
    public const string UserLockedOutMessage = "User has exceeded login attempts and account is locked out.";
    public const string InvalidEmailOrPasswordMessage = "Invalid email and/or password.";
    public const string UserIsInactiveMessage = "The user is not active for login.";

    // Initial exists
    public const string InitialAlertExistMessage = "{0} already exists. Please input another initial.";

    public const string InvalidEmailMessage = "Email is invalid.";

    public const string FirstLoginMessage =
        "You need to change your password because this is the first time you are signing in";

    public const string MessagePasswordExpired = "You need to change your password because your password has expired";

    public const string ClaimIssuer = "ECommerceIssuer";

    
    public const string FolderStandingInstructionTemplate = @"StandingInstruction\";

    public const string MessageTrace = "<> User <> {0} <> Ip Address <> {1} <> Time Spent <> {2} <> Message <> {3}";

    public const string TokenTypeBearer = "bearer";
    
    // Response Code and Message
    public const string FileExisted = "FILE_EXISTED";
    public const string FileExistedMessage = "File đã tồn tại, vui lòng kiểm tra lại. File: {0}";

}