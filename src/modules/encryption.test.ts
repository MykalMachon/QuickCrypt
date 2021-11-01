import { encrypt, decrypt } from './encryption';

describe("test encryption module", () => {
  it("should be able to encrypt data", () => {
    const encryptedMessage = encrypt('hello', 'world');
    const decryptMessage = decrypt(encryptedMessage, 'world');
    expect(decryptMessage).toBe('hello');
  })
})