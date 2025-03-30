default:
    @just --list

# Install dependencies
install:
    npm install

# Run tests
test *ARGS='':
    npm run test {{ARGS}}
    @echo "All tests passed successfully!"

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
    just test
    just lint
    just format
    just type-check
