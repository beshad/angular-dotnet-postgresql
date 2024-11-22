using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Data;
public class DataContext : DbContext
{
  public DataContext(DbContextOptions<DataContext> options) : base(options)
  {
    Logs = Set<Log>();
  }
  public DbSet<Log> Logs { get; set; }
}