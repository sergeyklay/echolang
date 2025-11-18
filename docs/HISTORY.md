## Session 1: Architect Role

```md
Act as a System Architect. We are building a minimal web-based LLM Translator called EchoLang.

## Requirements

1. Stack: Node.js (Backend), TypeScript + React + Vite (Frontend), SQLite (Database).
2. Core Features:
   - Deployment: This will be a single-user system deployed locally.
   - Translate text using an LLM (e.g., OpenAI/Anthropic/Gemini/Local LLM).
   - Tones/Styles: Users can define custom system prompts (e.g., 'Official', 'Slang', 'Financial'). These must be stored in the DB.
   - History: The user should be able to view the translation history.
   - Settings: CRUD for Tones and managing LLM API keys.
   - Security: No authorization or authentication is required.
3. Architecture: Clean, extensible, RESTful API.

## Task

Create a comprehensive ARCHITECTURE.md file. Include:

- Project description & features.
- Tech stack.
- Security design/capabilites
- Project structure (folder layout).
- A detailed SQLite schema (Prisma schema recommended).
- API Endpoint specifications (Method, Path, Body).
- A strategy for handling LLM API keys securely (encryption or user-provided).
```

- Writing prompt: ~ 15 min
- Generated time:  ~ 2 min
- Mode: Agentic
- Model: Auto
- Review time: ~ 5 min

## Session 2: Backend Role

```md
Act as a Senior Backend Developer. Initialize the project based on @ARCHITECTURE.md.

# Tasks

1. Set up a Node.js project with Express and TypeScript.
2. Configure Prisma with SQLite. Create the schema based on the on @ARCHITECTURE.md we just created and run migrations.
3. Implement the API Endpoints:
   - GET /tones, POST /tones, DELETE /tones
   - GET /history, POST /history (to save translation)
   - POST /translate: This should accept text, source/target language, and a tone ID. It should fetch the system prompt for that tone from the DB, call the LLM API, and return the result.
   - GET /api-keys, POST /api-keys, PUT /api-keys/:id, /api-keys/:id: Get, create, update, delete LLM API keys
4. Use dotenv for configuration.
5. Include proper error handling and validation.

Please execute the setup commands and write the code.
```

- Writing prompt: ~ 7 min
- Generated time:  ~ 5 min
- Mode: Agentic
- Model: Auto
- Review time: ~ 12 min


## Session 2: Seed script

```md
Create seed script for few tones, eg Default and Professional
```

- Writing prompt: < 1 min
- Generated time:  ~ 1 min
- Mode: Agentic
- Model: Auto
- Review time: ~ 2 min

## Session 3: Frontend Role (can run parallel to Session 2)

```md
Act as a Frontend Developer. Create the client-side application based on @ARCHITECTURE.md.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS (for styling)

## Design Style

- Minimalist
- Clean
- Flexible for further improvements
- Ensure mobile-responsive design

## Tasks

1. Initialize the Vite project in a client folder (or root, per architecture).
2. Header: Navigation menu with 'Translator', 'History', 'Settings'.
3. Translator Page (Home):
   - Two large text areas (Input / Output).
   - Dropdowns for Source Language, Target Language, and Tone (fetch tones from API).
   - A big 'Translate' button.
   - If there is no tone, Translate' button is disabled
4. Settings Page:
   - UI to Add/Edit/Delete Tones (Name + System Prompt).
   - Input field to save the LLM API Key (store in local storage or send to backend depending on security choice).
5. History Page: List past translations with a 'Copy' button.
```

- Writing prompt: ~ 7 min
- Generated time:  ~ 5 min
- Mode: Agentic
- Model: Auto
- Review time: ~ 10 min
- Fix errors using prompting: ~ 2 min
- Generated fix time:  ~ 1 min
- Manual test: ~ 4 min

## Session 4: Project's README.md

```md
Based on current codebase, as well as  @ARCHITECTURE.md create README.md file describing the project and get started.

## Design Style

- Follow best practices of modern popular project
- Be concise and concrete

## Tasks

1. Add project description and puprose
2. Add get started section
3. Add License section
```

- Writing prompt: < 1 min
- Generated time:  ~ 2 min
- Mode: Agentic
- Model: Auto
- Review time: ~ 5 min
- Add static files and 'Disclaimer' section: ~ 2 min
