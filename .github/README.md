# CI/CD Implementation

## Overview

This directory contains GitHub Actions workflow and Dependabot configuration for automated testing, security scanning, and dependency management.

## Workflows

### CI Pipeline (`workflows/ci.yml`)

Triggered on:

- Push to `main` branch
- Pull requests to `main`
- Tag pushes (`v*`)

#### Jobs

1. Test

   - Checkout code
   - Set up Docker Buildx
   - Run Docker Compose
   - Run tests and checks:
     - Install dependencies
     - Generate types
     - Type check
     - Lint
     - Format check
     - Run tests with coverage
   - Upload coverage reports
   - Upload reports to Codecov
   - Build check

2. Security
   - npm audit
   - CodeQL analysis (JavaScript/TypeScript)
   - License compliance check

## Dependency Management

### Dependabot (`dependabot.yml`)

Configured for:

- npm dependencies
- GitHub Actions
- Weekly updates
- Maximum 10 open PRs at a time

## Development Notes

- All tests must pass and coverage reports must be generated
- Security scan results are available in GitHub Security tab
- Dependencies are automatically updated when newer versions are available
- Review Dependabot PRs for breaking changes before merging
