# Security Considerations

- API keys should always be encrypted at rest using AES-256-GCM and not stored in plaintext
- Never commit `.env` files or encryption keys
- Master encryption key stored in `ENCRYPTION_KEY` environment variable and never stored in the database or in version control
- All API endpoints should validate input using Zod schemas
- For detailed security design, see [ARCHITECTURE.md](../ARCHITECTURE.md)
