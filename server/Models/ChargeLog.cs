namespace Server.Models
{
  public class ChargeLog
  {
    public int Id { get; set; }
    public string ChargerName { get; set; } = string.Empty;
    public string Message { get; set; } = null!;
  }
}
