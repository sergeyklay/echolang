# Coding Standards

This file provides coding standards for the EchoLang project. For agent-specific guidance, see [AGENTS.md](../AGENTS.md).

## TypeScript

- Use TypeScript strict mode
- Follow Airbnb style guide for TypeScript (enforced by ESLint)
- 100-character line length limit
- Use JSDoc style docstrings for functions, classes, and complex interfaces
- Imperative voice in descriptions, focus on side effects, parameters, return types, and potential errors
- Avoid obvious comments explaining basic syntax

## React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing
- File naming: PascalCase.tsx

## Dependency Management

**For dependency files:** Strict rules for managing project dependencies with npm.

### Core Principles

- **ONLY use `npm`** - alternative package managers (yarn, pnpm, bun) are forbidden in this project
- **Lock file committed** - `package-lock.json` must be in version control
- **Semantic versioning** - use version ranges thoughtfully to balance stability and updates
- **Security first** - regular audits and vulnerability checks are mandatory

### Essential Commands

```bash
# ✅ DO: Correct npm usage

npm install package-name                    # Add new dependency
npm install --save-dev package-name         # Add development dependency
npm install --save-exact package-name       # Add with exact version (for critical deps)
npm update package-name                     # Update specific package
npm ci                                      # Install from lock file (CI/CD)
npm audit                                   # Check for security vulnerabilities
npm audit fix                               # Fix vulnerabilities automatically
npm run script-name                         # Run scripts defined in package.json

# ❌ DON'T: Forbidden commands

npm install -g package-name                 # Never use global installations
npm install package-name@latest             # Don't use @latest syntax
yarn add package-name                       # Don't use yarn
pnpm add package-name                       # Don't use pnpm
bun add package-name                        # Don't use bun
npm install --no-package-lock               # Don't skip lock file generation
```

### Quick Reference

```bash
# Add dependency
npm install package-name

# Add development dependency
npm install --save-dev package-name

# Add with exact version (for critical dependencies)
npm install --save-exact package-name

# Install from lock file (use in CI/CD)
npm ci

# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Version Management

- **Production dependencies**: Prefer caret (`^`) for minor/patch updates, use exact versions (`--save-exact`) for critical dependencies
- **Development dependencies**: More flexible versioning acceptable
- **Review updates**: Always review `package-lock.json` changes before committing

### Critical Rules

- **NEVER use alternative package managers** - npm only in this project
- **Commit `package-lock.json`** - always version control lock file for reproducible builds
- **Use `npm ci` in CI/CD** - ensures clean installs from lock file
- **Regular security audits** - run `npm audit` regularly and fix vulnerabilities promptly
- **Review before adding** - evaluate necessity, security, and maintenance status of new dependencies
- **Avoid global installations** - keep all dependencies local to prevent conflicts
- **No `@latest` syntax** - explicit version ranges prevent unexpected major updates
