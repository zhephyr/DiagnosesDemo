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
        private String connectionStr = "mongodb://cc-admin:JMg4CCrY66Mg@45.33.27.14:27017/admin";

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
        public async Task<String> UpdateProductsAsync(HttpRequestMessage request, [FromBody] SingleOptions options)
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

        [Route("/bundles")]
        public async Task<String> GetBundlesAsync()
        {
            var client = new MongoClient(connectionStr);
            var db = client.GetDatabase("dev-db");
            var collection = db.GetCollection<ProductBundles>("bundles");
            var bundles = await collection.Find(new BsonDocument())
                .Project(Builders<ProductBundles>.Projection.Exclude("_id"))
                .ToListAsync();
            var obj = bundles.ToJson();
            return obj;
        }

        [HttpPost]
        [Route("/bundles/update")]
        public async Task<String> UpdateBundlesAsync(HttpRequestMessage request, [FromBody] BundleOptions options)
        {
            var client = new MongoClient(connectionStr);
            var db = client.GetDatabase("dev-db");
            var collection = db.GetCollection<ProductBundles>("bundles");
            var builder = Builders<ProductBundles>.Filter;
            FilterDefinition<ProductBundles> filter = new BsonDocument();

            if (options.Independance == 1)
            {
                filter = builder.AnyIn(x => x.CushType, "manual");
            }
            else if(options.Independance == -1)
            {
                filter = builder.AnyIn(x => x.CushType, "power");
            }

            if (options.Location == 1)
            {
                filter &= builder.Eq(x => x.InOut, "outdoor");
            }
            else if (options.Location == -1)
            {
                filter &= builder.Eq(x => x.InOut, "indoor");
            }

            if (options.Hcpcs.Length > 0)
            {
                filter &= builder.ElemMatch(x => x.Products, Builders<Product>.Filter.AnyIn(x => x.Hcpcs, options.Hcpcs));
            }

            var bundles = await collection.Find(filter)
                .Project(Builders<ProductBundles>.Projection.Exclude("_id"))
                .ToListAsync();
            return bundles.ToJson();
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
