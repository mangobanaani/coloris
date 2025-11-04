.PHONY: help install dev build start test test-ui test-debug lint security clean docker-build docker-run

# Default target
help:
	@echo "Coloris Game - Available commands:"
	@echo ""
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build production bundle"
	@echo "  make start          - Start production server"
	@echo "  make test           - Run all tests"
	@echo "  make test-ui        - Run tests with UI"
	@echo "  make test-debug     - Run tests in debug mode"
	@echo "  make lint           - Run linter"
	@echo "  make security       - Run security audit"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make all            - Run lint, build, and test"
	@echo ""

# Install dependencies
install:
	npm ci

# Development server
dev:
	npm run dev

# Build production bundle
build:
	npm run build

# Start production server
start:
	npm run start

# Run tests
test:
	npm test

# Run tests with UI
test-ui:
	npm run test:ui

# Run tests in debug mode
test-debug:
	npm run test:debug

# Run linter
lint:
	npm run lint

# Run security audit
security:
	@echo "Running npm audit..."
	npm audit
	@echo ""
	@echo "Checking for outdated packages..."
	npm outdated || true

# Clean build artifacts
clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf test-results
	rm -rf playwright-report

# Build Docker image
docker-build:
	docker build -t coloris:latest .

# Run Docker container
docker-run:
	docker run -p 3000:3000 coloris:latest

# Run all checks (lint, security, build, test)
all: lint security build test
	@echo "All checks passed!"
