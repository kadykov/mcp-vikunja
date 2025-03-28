default:
    @just --list

# Install dependencies
install:
    npm install

# Run tests
test *ARGS='':
    npm run test -- {{ARGS}}
    echo "Tests passed"
