using CryptographyHelper.Certificates;

namespace ECommerce.IdentityServer.ConfigurationOptions;

public class IdentityServerOptions
{
    public CertificateOption EncryptionCertificate { get; set; }

    public CertificateOption SigningCertificate { get; set; }
}
