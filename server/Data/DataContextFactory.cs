using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Server.Data
{
  public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
  {
    public DataContext CreateDbContext(string[] args)
    {
      var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
      optionsBuilder.UseNpgsql("Host=localhost;Database=SampleDb;Username=postgres;Password=postgres");
      return new DataContext(optionsBuilder.Options);
    }
  }
}



