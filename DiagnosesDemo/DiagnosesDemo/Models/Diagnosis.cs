using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class Diagnosis
    {
		[BsonElement("_id")]
		public ObjectId Id { get; set; }

		[BsonElement("ICD10")]
		public ObjectId ICD10 { get; set; }

		[BsonElement("desc")]
		public ObjectId Desc { get; set; }

		[BsonElement("group")]
		public ObjectId Group { get; set; }
	}
}