using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DiagnosesDemo.Models;
using MongoDB.Driver;
using MongoDB.Bson;

namespace DiagnosesDemo.Controllers
{
    public class HomeController : Controller
    {
		private String connectionStr = "mongodb://cc-dev:8G5EdJHiJk3j@localhost:27017/dev-db";

		public IActionResult Index()
        {
            return View();
        }

		[Route("/api/products")]
		public async Task<String> GetProductsAsync()
		{
			var client = new MongoClient(connectionStr);
			var db = client.GetDatabase("dev-db");
			var collection = db.GetCollection<BsonDocument>("product_families");
			var products = await collection.Find(new BsonDocument())
				.Project(Builders<BsonDocument>.Projection.Exclude("_id"))
				.ToListAsync();
			var obj = products.ToJson();
			return obj;
		}
	}
}
