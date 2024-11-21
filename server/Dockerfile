FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
RUN dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
RUN dotnet add package Microsoft.EntityFrameworkCore.Design
RUN dotnet restore
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
COPY . .
ENV ASPNETCORE_URLS=http://+:80
RUN dotnet build -c Release
RUN dotnet publish -c Release -o out
RUN dotnet ef database update --no-build
EXPOSE 80
ENTRYPOINT ["dotnet", "out/server.dll"]
