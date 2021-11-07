import { encrypt, decrypt } from './encryption';

describe('test encryption module', () => {
  it('should be able to encrypt data', () => {
    const { value: encryptedMessage, iv } = encrypt('hello', 'world');
    const decryptMessage = decrypt(encryptedMessage, 'world', iv);
    expect(decryptMessage).toBe('hello');
  });
});
