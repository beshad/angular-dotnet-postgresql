using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Data;
public class DataContext : DbContext
{
  public DataContext(DbContextOptions<DataContext> options) : base(options)
  {
    Logs = Set<Log>();
    Things = Set<Thing>();
  }
  public DbSet<Log> Logs { get; set; }
  public DbSet<Thing> Things { get; set; }
}