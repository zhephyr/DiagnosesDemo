using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DiagnosesDemo.Models;

namespace DiagnosesDemo.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

		[Route("/api/products")]
		public JsonResult GetProducts()
		{
			var products = new List<Product>();
			return Json(products);
		}
	}
}
