# Step 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the solution and all project files into the container
COPY . ./

# Restore dependencies for the entire solution
RUN dotnet restore LMS.API/LMS.API.csproj

# Build the project (LMS.API) and publish it to the /app/publish folder
RUN dotnet publish LMS.API/LMS.API.csproj -c Release -o /app/publish

# Step 2: Runtime stage (final image for running the application)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Set the working directory in the runtime container
WORKDIR /app

# Expose port 80 for the container
EXPOSE 80

# Copy the published application files from the build stage
COPY --from=build /app/publish .

# Set the entry point for the application
ENTRYPOINT ["dotnet", "LMS.API.dll"]
