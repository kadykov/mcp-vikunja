default:
    @just --list

# Install dependencies
install:
    npm install

# Run tests
test *ARGS='':
    npm run test {{ARGS}}
    @echo "All tests passed successfully!"

# Run tests with coverage
test-coverage *ARGS='':
    npm run test:coverage {{ARGS}}

# Lint code
lint:
    npm run lint
    @echo "Linting completed successfully!"

# Format code
format:
    npm run format

# Type check
type-check:
    npm run type-check
    @echo "Type checking completed successfully!"

# Generate types
generate-types:
    npm run generate-types

# Security scan dependencies for vulnerabilities
audit:
    npm audit

# Check license compliance
check-licenses:
    npx license-checker --production \
        --onlyAllow "MIT;ISC;BSD-2-Clause;BSD-3-Clause;Apache-2.0" \
        --excludePrivatePackages \
        --summary

# Run all security checks
security:
    @just audit
    @just check-licenses

# Build the project
build:
    npm run build

# Launch MCP inspector server
inspect:
    #!/usr/bin/env sh
    just build
    # Load .env variables and pass them to the inspector
    set -a
    . .env
    set +a
    npx @modelcontextprotocol/inspector \
        -e VIKUNJA_API_URL="$VIKUNJA_API_URL" \
        -e VIKUNJA_API_TOKEN="$VIKUNJA_API_TOKEN" \
        node dist/src/mcp/server.js

# Run all checks including security
all:
    @just generate-types
    @just format
    @just lint
    @just type-check
    @just build
    @just test-coverage
    @just security
