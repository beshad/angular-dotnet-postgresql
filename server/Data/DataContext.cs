using Server.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.Text.Json;
using CsvHelper;

namespace Server.Data;
public class DataContext : DbContext
{

  public DbSet<ChargeLog> ChargeLogs { get; set; }
  public DataContext(DbContextOptions<DataContext> options) : base(options)
  {
    ChargeLogs = Set<ChargeLog>();
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    var chargeLog = ReadChargeLogsFromFolder("./charge-logs");
    modelBuilder.Entity<ChargeLog>().HasData(chargeLog);
  }

  private IEnumerable<ChargeLog> ReadChargeLogsFromFolder(string folderPath)
  {
    var files = Directory.GetFiles(folderPath, "*.csv");
    var chargeLogs = new List<ChargeLog>();

    for (int i = 0; i < files.Length; i++)
    {
      var filePath = files[i];
      var fileName = Path.GetFileNameWithoutExtension(filePath);
      var parts = fileName.Split(" - ");
      if (parts.Length < 3) throw new FormatException("Invalid file name format.");

      var chargerName = parts[1];

      var fileContent = File.ReadAllText(filePath);
      chargeLogs.Add(new ChargeLog
      {
        Id = i + 1,
        ChargerName = chargerName,
        Message = fileContent
      });
    }
    return chargeLogs;
  }


}