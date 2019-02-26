using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class ProductFamilies
    {
		[BsonElement("name")]
		public String Name { get; set; }

		[BsonElement("desc")]
		public String Desc { get; set; }

		[BsonElement("main_img")]
		public String Main_img { get; set; }

		[BsonElement("categories")]
		public String[] Categories { get; set; }

		[BsonElement("products")]
		public String[] Skus { get; set; }

		[BsonElement("hcpcs")]
		public String[] Hcpcs { get; set; }
    }
}
