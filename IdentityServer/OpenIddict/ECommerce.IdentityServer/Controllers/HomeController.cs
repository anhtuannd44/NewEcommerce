﻿using Microsoft.AspNetCore.Mvc;

namespace ECommerce.IdentityServer.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
