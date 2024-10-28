#!/bin/sh

echo "Waiting for MongoDB to be ready..."
while ! nc -z mongodb 27017; do
  sleep 1
done

# Add additional wait time to ensure MongoDB is fully ready
sleep 5

echo "MongoDB is ready!"

echo "Running seed script..."
# Run seed with increased memory and additional flags
NODE_OPTIONS="--max-old-space-size=4096" npm run seed || {
    echo "Seed command failed with exit code $?"
    if [ -f "npm-debug.log" ]; then
        echo "Debug log contents:"
        cat npm-debug.log
    fi
    exit 1
}

echo "Starting application..."
exec npm run dev
