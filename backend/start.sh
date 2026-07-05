#!/bin/sh
echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx ts-node src/scripts/seed.ts

echo "Starting server..."
node dist/app.js