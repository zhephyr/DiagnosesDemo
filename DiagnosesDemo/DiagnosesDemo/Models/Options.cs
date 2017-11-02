using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class Options
    {
		public String MainCat { get; set; }
		public String ProdType { get; set; }
		public String[] Hcpcs { get; set; }
		public String Size { get; set; }
	}
}
