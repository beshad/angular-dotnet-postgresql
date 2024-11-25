using Server.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Server.Data;
public class DataContext : DbContext
{

  public DbSet<Log> Logs { get; set; }
  public DbSet<Thing> Things { get; set; }
  public DataContext(DbContextOptions<DataContext> options) : base(options)
  {
    Logs = Set<Log>();
    Things = Set<Thing>();
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // modelBuilder.Entity<Log>().HasData(
    //     new Log { Id = 1, Name = "Log Entry 1" },
    //     new Log { Id = 2, Name = "Log Entry 2" },
    //     new Log { Id = 3, Name = "Log Entry 3" }
    // );

    var logData = ReadLogDataFromFile("./seeds.json");
    modelBuilder.Entity<Log>().HasData(logData);
  }

  private List<Log> ReadLogDataFromFile(string filePath)
  {
    if (!File.Exists(filePath))
      throw new FileNotFoundException("Log data file not found", filePath);

    var jsonData = File.ReadAllText(filePath);
    return JsonConvert.DeserializeObject<List<Log>>(jsonData) ?? new List<Log>();
  }

}