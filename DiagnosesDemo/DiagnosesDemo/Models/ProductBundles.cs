using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class ProductBundles
    {
        [BsonElement("id")]
        public Int16 Id { get; set; }

        [BsonElement("products")]
        public List<Product> Products { get; set; }

        [BsonElement("indoor_outdoor")]
        public string InOut { get; set; }

        [BsonElement("min_max")]
        public string MinMax { get; set; }

        [BsonElement("cush_type")]
        public string CushType { get; set; }

        [BsonElement("chair_func")]
        public List<string> ChairFuncs { get; set; }
    }

    public class Product
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("desc")]
        public string Desc { get; set; }

        [BsonElement("hcpcs")]
        public List<string> Hcpcs { get; set; }
    }
}
