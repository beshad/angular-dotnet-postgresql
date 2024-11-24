FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
RUN dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
RUN dotnet add package Microsoft.EntityFrameworkCore.Design
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
COPY . .
RUN dotnet build -c Release
RUN dotnet ef migrations add InitialCreate
RUN dotnet ef migrations add SeedLogs
# RUN dotnet ef database update
ENV ASPNETCORE_URLS=http://+:80
RUN dotnet publish -c Release -o out
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "out/server.dll"]
