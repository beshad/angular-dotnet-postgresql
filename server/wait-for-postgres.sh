#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U "postgres"; do
  echo >&2 "Postgres is unavailable - sleeping"
  sleep 2
done

echo >&2 ">>>>> Postgres is up - executing command <<<<<"
exec $cmd
