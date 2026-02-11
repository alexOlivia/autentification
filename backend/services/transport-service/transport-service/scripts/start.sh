#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Install dependencies
npm install

# Run database migrations
bash scripts/migrate.sh

# Start the application
npm run start