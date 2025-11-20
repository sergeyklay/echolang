# EchoLang

A minimal web-based LLM Translator for single-user local deployment. Translate text using various LLM providers (OpenAI, Anthropic, Gemini, or local LLMs) with customizable tones and styles.

![Screenshot 1](./docs/screenshots/Screenshot1.png)

## Disclaimer

My goal was to build a fully finished app that's actually useful to me and just works - without writing a single line of code myself. I offloaded the whole thing to the LLM. Basically, I was testing the agentic capabilities of AI to see what this means for developers. And I want to emphasize this again: *I didn't write one bit of code for this app*. I spent 1 hour and 28 minutes on base implementation of this project - prompting agents, code review, manual testing, code-generation, etc. Then I added Quality-of-Life improvements to the project and spent another 22 minutes on that. Total time spent on this project was 1 hour and 50 minutes.

This project is a proof-of-concept for fully AI-driven development. Since I didn't write the lines myself, treat this as experimental software.

It works for me, but it comes with **no warranties**. Always audit the code before using it for anything serious.

During the development of this project, I kept records of all the prompts I used with the agents, along with tracked timings for each major task. You’ll find all of these details in [docs/HISTORY.md](./docs/HISTORY.md). If you’re interested in repeating this experiment or trying something similar, feel free to use this file as a reference.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Gemini, and local LLMs
- **Custom Tones**: Define and manage custom translation styles (e.g., 'Official', 'Slang', 'Financial')
- **Translation History**: View and manage past translations
- **Secure API Key Storage**: API keys encrypted at rest using AES-256-GCM
- **Settings Management**: CRUD operations for tones and API key configuration

## Tech Stack

- **Backend**: Node.js v24, TypeScript, Express.js, SQLite with Prisma
- **Frontend**: React, Vite, TypeScript, Tailwind CSS

## Documentation

- [Project Architecture](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/rules/development.md)
- [Dependency Management](./docs/rules/dependency-management.md)
- [Coding Standards](./docs/rules/coding-standards.md)
- [Troubleshooting](./docs/rules/troubleshooting.md)
- [Security](./docs/rules/security.md)
- [Testing](./docs/rules/testing.md)

## License

See [LICENSE](./LICENSE) for details.
