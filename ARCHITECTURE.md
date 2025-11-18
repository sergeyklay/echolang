# EchoLang Architecture

## Project Description

EchoLang is a minimal web-based LLM Translator designed for single-user local deployment. It enables users to translate text using various LLM providers (OpenAI, Anthropic, Gemini or local LLMs) with customizable tones and styles. The system maintains a translation history and provides settings management for tones and API keys.

## Core Features

- **Text Translation**: Translate text using configurable LLM providers
- **Custom Tones/Styles**: Define and manage custom system prompts (e.g., 'Official', 'Slang', 'Financial')
- **Translation History**: View and manage past translations
- **Settings Management**: CRUD operations for tones and LLM API key configuration
- **Multi-Provider Support**: Support for OpenAI, Anthropic, Gemini, and local LLMs

## Tech Stack

### Backend
- **Runtime**: Node.js v24
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS Modules or Tailwind CSS (optional)

### Development Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Code Formatting**: Prettier (optional)
- **Linting**: ESLint (optional)

## Security Design

### Security Capabilities

1. **API Key Encryption**
   - API keys stored in database are encrypted at rest using AES-256-GCM
   - Encryption key derived from environment variable or user-provided master key
   - Keys are decrypted only when needed for API calls

2. **Input Validation**
   - All API endpoints validate input using Zod schemas
   - Sanitization of user inputs to prevent injection attacks
   - Rate limiting on translation endpoints (optional)

3. **Local Deployment Security**
   - No authentication/authorization required (single-user system)
   - API runs on localhost by default
   - CORS configured for local development only

4. **Environment Variables**
   - Sensitive configuration stored in `.env` files (gitignored)
   - Master encryption key stored in environment variable `ENCRYPTION_KEY`
   - Local LLM base URL configurable via Settings API (stored in database)
   - No hardcoded secrets

## Project Structure

```
echolang/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── translation.controller.ts
│   │   │   ├── tone.controller.ts
│   │   │   ├── history.controller.ts
│   │   │   └── settings.controller.ts
│   │   ├── services/
│   │   │   ├── llm/
│   │   │   │   ├── llm.service.ts
│   │   │   │   ├── openai.service.ts
│   │   │   │   ├── anthropic.service.ts
│   │   │   │   ├── gemini.service.ts
│   │   │   │   └── local.service.ts
│   │   │   ├── encryption.service.ts
│   │   │   └── translation.service.ts
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/
│   │   │   ├── translation.routes.ts
│   │   │   ├── tone.routes.ts
│   │   │   ├── history.routes.ts
│   │   │   └── settings.routes.ts
│   │   ├── utils/
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── Translator.tsx
│   │   │   ├── History.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useLocalStorage.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .envrc
├── .gitignore
├── ARCHITECTURE.md
└── README.md
```

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Tone {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  systemPrompt String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  translations Translation[]

  @@map("tones")
}

model Translation {
  id            String   @id @default(cuid())
  sourceText    String
  translatedText String
  sourceLanguage String
  targetLanguage String
  toneId        String?
  llmProvider   String   // 'openai', 'anthropic', 'gemini', 'local'
  model         String?  // e.g., 'gpt-4', 'claude-3-opus', etc.
  createdAt     DateTime @default(now())

  tone          Tone?    @relation(fields: [toneId], references: [id], onDelete: SetNull)

  @@index([createdAt])
  @@map("translations")
}

model ApiKey {
  id          String   @id @default(cuid())
  provider    String   @unique // 'openai', 'anthropic', 'gemini', 'local'
  encryptedKey String  // Encrypted API key
  baseUrl     String?  // Optional base URL for local LLM provider
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("api_keys")
}
```

## API Endpoint Specifications

### Translation Endpoints

#### POST /api/translate
Translate text using an LLM.

**Request Body:**
```json
{
  "sourceText": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "toneId": "optional-tone-id",
  "llmProvider": "openai",
  "model": "gpt-4"
}
```

**Response:**
```json
{
  "id": "translation-id",
  "sourceText": "Hello, world!",
  "translatedText": "¡Hola, mundo!",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "toneId": "optional-tone-id",
  "llmProvider": "openai",
  "model": "gpt-4",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### History Endpoints

#### GET /api/translations
Get translation history with optional filters.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `toneId` (optional): Filter by tone ID
- `llmProvider` (optional): Filter by LLM provider

**Response:**
```json
{
  "data": [
    {
      "id": "translation-id",
      "sourceText": "Hello, world!",
      "translatedText": "¡Hola, mundo!",
      "sourceLanguage": "en",
      "targetLanguage": "es",
      "toneId": "optional-tone-id",
      "toneName": "Official",
      "llmProvider": "openai",
      "model": "gpt-4",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

#### GET /api/translations/:id
Get a specific translation by ID.

**Response:**
```json
{
  "id": "translation-id",
  "sourceText": "Hello, world!",
  "translatedText": "¡Hola, mundo!",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "toneId": "optional-tone-id",
  "toneName": "Official",
  "llmProvider": "openai",
  "model": "gpt-4",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/translations/:id
Delete a translation by ID.

**Response:**
```json
{
  "success": true,
  "message": "Translation deleted successfully"
}
```

### Tone Endpoints

#### GET /api/tones
Get all tones.

**Response:**
```json
{
  "data": [
    {
      "id": "tone-id",
      "name": "Official",
      "description": "Formal and professional tone",
      "systemPrompt": "Translate in a formal and professional manner.",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/tones
Create a new tone.

**Request Body:**
```json
{
  "name": "Slang",
  "description": "Casual and informal tone",
  "systemPrompt": "Translate using casual and informal language with slang."
}
```

**Response:**
```json
{
  "id": "tone-id",
  "name": "Slang",
  "description": "Casual and informal tone",
  "systemPrompt": "Translate using casual and informal language with slang.",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### GET /api/tones/:id
Get a specific tone by ID.

**Response:**
```json
{
  "id": "tone-id",
  "name": "Official",
  "description": "Formal and professional tone",
  "systemPrompt": "Translate in a formal and professional manner.",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/tones/:id
Update a tone.

**Request Body:**
```json
{
  "name": "Official Updated",
  "description": "Updated description",
  "systemPrompt": "Updated system prompt"
}
```

**Response:**
```json
{
  "id": "tone-id",
  "name": "Official Updated",
  "description": "Updated description",
  "systemPrompt": "Updated system prompt",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/tones/:id
Delete a tone.

**Response:**
```json
{
  "success": true,
  "message": "Tone deleted successfully"
}
```

### Settings Endpoints

#### GET /api/settings/api-keys
Get all API key configurations (encrypted keys are not returned).

**Response:**
```json
{
  "data": [
    {
      "id": "key-id",
      "provider": "openai",
      "isActive": true,
      "hasKey": true,
      "baseUrl": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "key-id-2",
      "provider": "local",
      "isActive": true,
      "hasKey": true,
      "baseUrl": "http://localhost:11434",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/settings/api-keys
Create or update an API key.

**Request Body:**
```json
{
  "provider": "openai",
  "apiKey": "sk-...",
  "isActive": true,
  "baseUrl": "http://localhost:11434"
}
```

**Note:** `baseUrl` is optional and only used for the "local" provider. For other providers, it should be omitted or set to null.

**Response:**
```json
{
  "id": "key-id",
  "provider": "openai",
  "isActive": true,
  "hasKey": true,
  "baseUrl": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/settings/api-keys/:id
Update an API key configuration.

**Request Body:**
```json
{
  "apiKey": "sk-new-key",
  "isActive": true,
  "baseUrl": "http://localhost:11434"
}
```

**Note:** All fields are optional. At least one field must be provided. `baseUrl` is only relevant for the "local" provider.

**Response:**
```json
{
  "id": "key-id",
  "provider": "openai",
  "isActive": true,
  "hasKey": true,
  "baseUrl": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/settings/api-keys/:id
Delete an API key configuration.

**Response:**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

## LLM API Key Security Strategy

### Encryption Approach

1. **Master Key Management**
   - Master encryption key stored in environment variable `ENCRYPTION_KEY`
   - Key must be at least 32 bytes (256 bits) for AES-256-GCM
   - Generated using: `openssl rand -base64 32`
   - Never committed to version control

2. **Encryption Implementation**
   - Use Node.js `crypto` module with AES-256-GCM
   - Each API key encrypted with unique IV (Initialization Vector)
   - IV and encrypted data stored together in database
   - Format: `iv:encryptedData` (base64 encoded)

3. **Encryption Service Flow**
   ```
   Encryption:
   - Generate random IV (12 bytes for GCM)
   - Encrypt API key using AES-256-GCM
   - Combine IV and encrypted data
   - Store as base64 string in database

   Decryption:
   - Extract IV from stored string
   - Decrypt using master key and IV
   - Return plaintext API key
   ```

4. **Key Storage**
   - Encrypted keys stored in `ApiKey.encryptedKey` field
   - Master key never stored in database
   - Decryption only occurs when making LLM API calls
   - Decrypted keys never logged or exposed in responses

5. **User-Provided Key Alternative**
   - Option to use user-provided master key via environment variable
   - If not provided, system generates and stores in `.env`
   - User can rotate master key (requires re-encryption of all keys)

6. **Security Best Practices**
   - API keys never returned in API responses
   - Only `hasKey` boolean flag returned to indicate presence
   - Encryption key rotation process documented
   - Environment variables validated on startup

### Example Encryption Service Interface

```typescript
interface EncryptionService {
  encrypt(plaintext: string): string;
  decrypt(encrypted: string): string;
  rotateMasterKey(newKey: string): Promise<void>;
}
```

