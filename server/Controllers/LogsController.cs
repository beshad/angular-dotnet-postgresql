using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

[Route("api/[controller]")]
[ApiController]
public class LogsController : ControllerBase
{
  private readonly ExampleContext _context;

  public LogsController(ExampleContext context)
  {
    _context = context;
  }

  // GET: api/logs
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Log>>> GetLogs()
  {
    return await _context.Logs.ToListAsync();
  }
}
