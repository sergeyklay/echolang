# AGENTS.md

This file provides guidance for AI coding agents working on the EchoLang project. The main developer documentation lives in the `docs` directory. For detailed architecture and API documentation, see [Project Architecture](./docs/ARCHITECTURE.md). For development setup and workflows, see [Development Guide](./docs/rules/development.md).

## Project Overview

EchoLang is a minimal web-based LLM Translator for single-user local deployment. It enables translation using various LLM providers (OpenAI, Anthropic, Gemini, or local LLMs) with customizable tones and styles.

**Key Technologies:**

- Backend: Node.js v24, TypeScript, Express.js, SQLite with Prisma ORM
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Package Manager: **npm only** (no yarn, pnpm, or bun)

Here are the main guidelines for working on this project:

- For detailed project structure, its architecture, and API specifications, see [Project Architecture](./docs/ARCHITECTURE.md)
- For detailed coding standards, see [Coding Standards](./docs/rules/coding-standards.md)
- For initial setup, and development workflow, follow the instructions in [Development Guide](./docs/rules/development.md)
- For dependency management, see [Dependency Management](./docs/rules/dependency-management.md)
- For troubleshooting, see [Troubleshooting](./docs/rules/troubleshooting.md)
- For security considerations, see [Security](./docs/rules/security.md)
- For testing guidelines, see [Testing](./docs/rules/testing.md)
