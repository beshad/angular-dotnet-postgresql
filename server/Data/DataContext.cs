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
      string[] lines = File.ReadAllLines(filePath);
      string chargerName = lines[0].Split(',')[1].Trim(); //first line
      string chargerSerialNumber = lines[1].Split(',')[1].Trim();

      var fileContent = File.ReadAllText(filePath);
      chargeLogs.Add(new ChargeLog
      {
        Id = i + 1,
        ChargerSerialNumber = chargerSerialNumber,
        ChargerName = chargerName,
        Message = fileContent
      });
    }
    return chargeLogs;
  }


}