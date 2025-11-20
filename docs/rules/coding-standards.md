# Coding Standards

This file provides coding standards for the EchoLang project. For agent-specific guidance, see [AGENTS.md](../AGENTS.md).

## Quick reference

- TypeScript strict mode, Airbnb style guide, 100-character line-length limit
- React functional components with hooks
- **ONLY use npm** - alternative package managers (yarn, pnpm, bun) are forbidden in this project

## TypeScript

- Use TypeScript strict mode
- Follow Airbnb style guide for TypeScript (enforced by ESLint)
- 100-character line-length limit
- Use JSDoc style docstrings for functions, classes, and complex interfaces
- Imperative voice in descriptions, focus on side effects, parameters, return types, and potential errors
- Avoid obvious comments explaining basic syntax

## React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing
- File naming: PascalCase.tsx
