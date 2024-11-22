using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Data;
public class ApiDbContext : DbContext
{
  public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
  {

  }
  public DbSet<Log> Logs { get; set; }
}