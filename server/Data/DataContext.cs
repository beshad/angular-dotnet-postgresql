using Server.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.Text.Json;
using CsvHelper;
using Newtonsoft.Json.Linq;
using System.Text;

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

      string[] dataLines = lines.Skip(3).Take(10).ToArray(); // just take 10 linesas CSV files are too large
      string[] columnNames = lines[3].Split(',');

      var jsonData = new JObject();
      var dataArray = new JArray();
      jsonData["data"] = dataArray;

      foreach (string line in dataLines)
      {
        string[] values = line.Split(',');
        var row = new JObject();
        for (int j = 0; j < columnNames.Length; j++)
        {
          row[columnNames[j].Trim()] = values[j].Trim();
        }
        dataArray.Add(row);
      }

      chargeLogs.Add(new ChargeLog
      {
        Id = i + 1,
        ChargerSerialNumber = chargerSerialNumber,
        ChargerName = chargerName,
        Message = jsonData.ToString()
      });
    }
    return chargeLogs;
  }
}