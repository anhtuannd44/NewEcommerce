using Grpc.Net.Client;

namespace ECommerce.Common.Infrastructure.Grpc;

public class ChannelFactory
{
    public static GrpcChannel Create(string address)
    {
        var channel = GrpcChannel.ForAddress(address,
            new GrpcChannelOptions
            {
                HttpClient = new HttpClient(new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true,
                }),
            });

        return channel;
    }
}