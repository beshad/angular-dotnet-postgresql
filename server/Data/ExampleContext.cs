using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Server.Models;
using Server.Data;

namespace Server.Data
{
  public class ExampleContext : DbContext
  {
    public DbSet<Log> Logs { get; set; }

    // Constructor accepting DbContextOptions
    public ExampleContext(DbContextOptions<ExampleContext> options) : base(options)
    {
    }
  }
}
