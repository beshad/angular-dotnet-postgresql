using Server.Data;
using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DATA.Controllers;
[ApiController]
[Route("api")]
public class DataController : ControllerBase
{
  private readonly ILogger<DataController> _logger;
  private readonly DataContext _context;
  public DataController(
      ILogger<DataController> logger,
      DataContext context)
  {
    _logger = logger;
    _context = context;
  }

  // /api/logs
  [HttpGet(Name = "logs")]
  public async Task<IActionResult> Get()
  {
    var log = new Log()
    {
      Name = "Sample Log Written to DB"
    };
    await _context.Logs.AddAsync(log);
    await _context.SaveChangesAsync();
    var logs = await _context.Logs.ToListAsync();
    return Ok(logs);
  }

  // api/things
  [HttpGet("things")]
  public async Task<IActionResult> GetThings()
  {
    var sampleThings = new[]
    {
        new { Name = "Sample thing endpoint 1" },
        new { Name = "Sample thing endpoint 2" },
        new { Name = "Sample thing endpoint 3" }
    };

    // artificial asynchronous operation
    return await Task.FromResult(Ok(sampleThings));
  }

  // api/test
  [HttpGet("test")]
  public IActionResult Test()
  {
    var sampleResponse = new
    {
      Message = "This is a test endpoint",
      Timestamp = DateTime.UtcNow
    };
    return Ok(sampleResponse);
  }
}