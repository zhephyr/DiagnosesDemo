using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiagnosesDemo.Models
{
    public class Product
    {
		public String name { get; set; }
		public String desc { get; set; }
		public String main_img { get; set; }
		public String[] catagories { get; set; }
    }
}
