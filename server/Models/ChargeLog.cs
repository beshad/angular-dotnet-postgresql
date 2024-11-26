using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Server.Models
{
  public class ChargeLog
  {
    public int Id { get; set; }
    public string ChargerSerialNumber { get; set; } = string.Empty;
    public string ChargerName { get; set; } = string.Empty;
    // [Column(TypeName = "jsonb")]
    public string Message { get; set; } = null!;
  }
}
