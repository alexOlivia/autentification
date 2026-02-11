#!/bin/bash

# Navigate to the Prisma directory
cd prisma

# Run the Prisma migrate command to apply migrations
npx prisma migrate deploy

# Optionally, you can also generate the Prisma client after migrations
npx prisma generate

# Return to the original directory
cd ..