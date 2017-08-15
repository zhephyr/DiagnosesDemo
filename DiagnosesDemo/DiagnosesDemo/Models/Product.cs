using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class Product
    {
		[BsonElement("name")]
		public String Name { get; set; }

		[BsonElement("desc")]
		public String Desc { get; set; }

		[BsonElement("main_img")]
		public String Main_img { get; set; }

		[BsonElement("categpries")]
		public String[] Catagories { get; set; }
    }
}
