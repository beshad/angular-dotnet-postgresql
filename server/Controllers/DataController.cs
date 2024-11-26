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

  // /api/charge-logs
  [HttpGet("charge-logs")]
  public async Task<IActionResult> GetLogs()
  {
    var logs = await _context.ChargeLogs.ToListAsync();
    return Ok(logs);
  }




}