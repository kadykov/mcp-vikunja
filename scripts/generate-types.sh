#!/bin/bash
set -e

echo "Generating TypeScript types..."
mkdir -p src/types/openapi
npx swagger2openapi http://vikunja:3456/api/v1/docs.json | \
  npx openapi-typescript /dev/stdin --output src/types/openapi/index.ts

echo "Formatting generated types..."
npx prettier --write src/types/openapi/index.ts

echo "Types generated successfully!"
