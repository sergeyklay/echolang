import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { encryptionService } from './encryption.service';
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('EncryptionService', () => {
  const originalEnv = process.env.ENCRYPTION_KEY;
  const validKey = Buffer.from('a'.repeat(32)).toString('base64');

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = validKey;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ENCRYPTION_KEY = originalEnv;
    } else {
      delete process.env.ENCRYPTION_KEY;
    }
  });

  describe('encrypt', () => {
    it('should encrypt plaintext successfully', () => {
      const plaintext = 'test-api-key';
      const encrypted = encryptionService.encrypt(plaintext);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
      expect(typeof encrypted).toBe('string');
    });

    it('should produce different outputs for same input (IV uniqueness)', () => {
      const plaintext = 'test-api-key';
      const encrypted1 = encryptionService.encrypt(plaintext);
      const encrypted2 = encryptionService.encrypt(plaintext);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted text successfully', () => {
      const plaintext = 'test-api-key';
      const encrypted = encryptionService.encrypt(plaintext);
      const decrypted = encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle encrypt/decrypt roundtrip', () => {
      const testCases = [
        'simple-key',
        'sk-1234567890abcdef',
        'a'.repeat(100),
        'special-chars-!@#$%^&*()',
      ];

      testCases.forEach((plaintext) => {
        const encrypted = encryptionService.encrypt(plaintext);
        const decrypted = encryptionService.decrypt(encrypted);
        expect(decrypted).toBe(plaintext);
      });
    });
  });

  describe('error handling', () => {
    it('should throw error when ENCRYPTION_KEY is missing', () => {
      delete process.env.ENCRYPTION_KEY;

      expect(() => {
        encryptionService.encrypt('test');
      }).toThrow('Failed to encrypt data');
    });

    it('should throw error when ENCRYPTION_KEY has invalid format', () => {
      process.env.ENCRYPTION_KEY = 'invalid-key';

      expect(() => {
        encryptionService.encrypt('test');
      }).toThrow('Failed to encrypt data');
    });
  });
});

