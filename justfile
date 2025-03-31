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

# Format code
format:
    npm run format

# Type check
type-check:
    npm run type-check

# Generate types
generate-types:
    npm run generate-types

# Run all checks
all:
    @just generate-types
    @just format
    @just lint
    @just type-check
    @just test-coverage
