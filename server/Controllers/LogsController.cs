using Server.Data;
using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppDemo.Controllers;
[ApiController]
[Route("[controller]")]
public class DriversController : ControllerBase
{
  private readonly ILogger<DriversController> _logger;
  private readonly ApiDbContext _context;
  public DriversController(
      ILogger<DriversController> logger,
      ApiDbContext context)
  {
    _logger = logger;
    _context = context;
  }
  [HttpGet(Name = "GetAllDrivers")]
  public async Task<IActionResult> Get()
  {
    var driver = new Log()
    {
      Name = "Behshad Ghorbani"
    };
    await _context.Logs.AddAsync(driver);
    await _context.SaveChangesAsync();
    var drivers = await _context.Logs.ToListAsync();
    return Ok(drivers);
  }
}