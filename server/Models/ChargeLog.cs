namespace Server.Models
{
  public class ChargeLog
  {
    public int Id { get; set; }
    public double Timestamp { get; set; }
    public string ChargerName { get; set; } = string.Empty;
    public string Data { get; set; } = null!;
  }
}
