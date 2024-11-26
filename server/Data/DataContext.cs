using Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using CsvHelper;
using Newtonsoft.Json.Linq;
using CsvHelper.Configuration;

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
  public IEnumerable<ChargeLog> ReadChargeLogsFromFolder(string folderPath)
  {
    var files = Directory.GetFiles(folderPath, "*.csv");
    var chargeLogs = new List<ChargeLog>();

    for (int i = 0; i < files.Length; i++)
    {
      var filePath = files[i];
      var lines = File.ReadAllLines(filePath);

      string chargerName = lines[0].Split(',')[1].Trim();
      string chargerSerialNumber = lines[1].Split(',')[1].Trim();

      var dataLines = string.Join(Environment.NewLine, lines.Skip(3));

      using (var reader = new StringReader(dataLines))
      using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { HasHeaderRecord = true }))
      {
        var records = csv.GetRecords<dynamic>().Take(20).ToList(); // Limit to first 20 records

        var jsonData = new JObject();
        var dataArray = new JArray();
        jsonData["data"] = dataArray;

        foreach (var record in records)
        {
          var row = new JObject();
          foreach (var property in record)
          {
            row[property.Key] = property.Value.ToString().Trim();
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
    }

    return chargeLogs;
  }




}