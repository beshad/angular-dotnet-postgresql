#!/bin/bash

POSTGRES_CONTAINER_NAME="postgres"
DOTNET_CONTAINER_NAME="dotnet"

function wait_for_postgres {
  echo "Waiting for PostgreSQL to be ready..."
  while [[ "$(docker inspect --format='{{.State.Health.Status}}' $POSTGRES_CONTAINER_NAME 2>/dev/null)" != "healthy" ]]; do
    echo "PostgreSQL is not ready yet. Retrying in 5 seconds..."
    sleep 5
  done
  echo "PostgreSQL is ready!"
}

wait_for_postgres

echo "Running bash commands in the .NET container..."

docker exec -it $DOTNET_CONTAINER_NAME bash -c "dotnet ef migrations add SeedLogs"
docker exec -it $DOTNET_CONTAINER_NAME bash -c "dotnet ef database update"

if [[ $? -eq 0 ]]; then
  echo "Database update completed successfully!"
else
  echo "Database update failed. Check logs for details."
  exit 1
fi
