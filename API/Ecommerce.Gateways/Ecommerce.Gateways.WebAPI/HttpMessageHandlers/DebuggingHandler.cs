﻿namespace Ecommerce.Gateways.WebAPI.HttpMessageHandlers;

public abstract class DebuggingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var response = await base.SendAsync(request, cancellationToken);
        return response;
    }
}
