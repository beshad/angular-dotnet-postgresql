# Use the official .NET 8.0 SDK image as a base
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Set the working directory to /app
WORKDIR /app

# Copy the project files into the working directory
COPY *.csproj ./

# Restore the NuGet packages
RUN dotnet restore

# Copy the rest of the project files into the working directory
COPY . .

ENV ASPNETCORE_URLS=http://+:80

# Build the project
RUN dotnet build -c Release

# Publish the project to a directory
RUN dotnet publish -c Release -o out

# Expose the port that the web app will use
EXPOSE 80

# Set the entry point to run the web app
ENTRYPOINT ["dotnet", "out/server.dll"]
