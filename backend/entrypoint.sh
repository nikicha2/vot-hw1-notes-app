#!/bin/bash
set -e

echo "Waiting for database to be ready..."
while ! nc -z ${DB_HOST} ${DB_PORT}; do
  sleep 0.1
done
echo "Database is ready!"

echo "Making migrations..."
python manage.py makemigrations

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
