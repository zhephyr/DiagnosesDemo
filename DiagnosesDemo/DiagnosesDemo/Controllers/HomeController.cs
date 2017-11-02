using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DiagnosesDemo.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Net.Http;

namespace DiagnosesDemo.Controllers
{
	public class HomeController : Controller
	{
		private String connectionStr = "mongodb://cc-dev:8G5EdJHiJk3j@localhost:27017/dev-db";

		public IActionResult Index()
		{
			return View();
		}

		[Route("/products")]
		public async Task<String> GetProductsAsync()
		{
			var client = new MongoClient(connectionStr);
			var db = client.GetDatabase("dev-db");
			var collection = db.GetCollection<ProductFamilies>("product_families");
			var products = await collection.Find(new BsonDocument())
				.Project(Builders<ProductFamilies>.Projection.Exclude("_id"))
				.ToListAsync();
			var obj = products.ToJson();
			return obj;
		}

		[HttpPost]
		[Route("/products/update")]
		public async Task<String> UpdateProductsAsync(HttpRequestMessage request, [FromBody] Options options)
		{
			var client = new MongoClient(connectionStr);
			var db = client.GetDatabase("dev-db");
			var collection = db.GetCollection<ProductFamilies>("product_families");
			var builder = Builders<ProductFamilies>.Filter;
			FilterDefinition<ProductFamilies> filter = new BsonDocument();

			switch (options.MainCat)
			{
				case "REHAB":
					filter = builder.AnyEq(x => x.Categories, "REHAB");
					break;
				case "LTC":
					filter = builder.AnyEq(x => x.Categories, "LTC");
					break;
				default:
					break;
			}

			switch (options.ProdType)
			{
				case "SEATCU":
					filter &= builder.AnyEq(x => x.Categories, "SEATCU");
					break;
				case "BACKCU":
					filter &= builder.AnyEq(x => x.Categories, "BACKCU");
					break;
				case "ACCESS":
					filter &= builder.AnyEq(x => x.Categories, "ACCESS");
					break;
				default:
					break;
			}

			if (options.Hcpcs.Length > 0)
			{
				filter &= builder.AnyIn("hcpcs", options.Hcpcs);
			}

			var products = await collection.Find(filter)
				.Project(Builders<ProductFamilies>.Projection.Exclude("_id"))
				.ToListAsync();
			return products.ToJson();
		}

		[Route("/diagnoses")]
		public async Task<String> GetDiagnosisListAsync()
		{
			var client = new MongoClient(connectionStr);
			var db = client.GetDatabase("dev-db");
			var collection = db.GetCollection<Diagnosis>("diagnoses");
			var products = await collection.Find(new BsonDocument())
				.Project(Builders<Diagnosis>.Projection.Exclude("_id"))
				.ToListAsync();
			var obj = products.ToJson();
			return obj;
		}

		[Route("/hcpcs/update")]
		public async Task<String> GetHcpcsCodesAsync(HttpRequestMessage request, [FromBody] String[] diagnoses)
		{
			var client = new MongoClient(connectionStr);
			var db = client.GetDatabase("dev-db");
			var collection = db.GetCollection<BsonDocument>("diagnoses");
			var builder = Builders<BsonDocument>.Filter;
			var filter = builder.AnyIn("ICD10", diagnoses);
			var groupList = collection.Distinct<dynamic>("group", filter).ToList();

			collection = db.GetCollection<BsonDocument>("prognosis_groups");
			filter = builder.All("and", new BsonArray(groupList)) | builder.AnyIn("or", new BsonArray(groupList));
			var hcpcs = await collection.Find(filter)
				.Project(Builders<BsonDocument>.Projection.Include("hcpcs").Exclude("_id"))
				.ToListAsync();
			var obj = hcpcs.ToJson();
			return obj;
		}
	}
}
