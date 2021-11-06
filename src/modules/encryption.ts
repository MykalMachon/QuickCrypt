import crypto from 'crypto';

// TODO: set and get an IV for the installation if it can exist.

const hashFunction = (key: string) => {
  const hasher = crypto.createHash('sha256');
  hasher.update(key);
  return hasher.digest('hex').substr(0, 32);
};

export const encrypt = (message: string, key: string) => {
  const hashedKey = hashFunction(key);
  const randomIv = crypto.randomBytes(16);
  const ivString = randomIv.toString('hex').slice(0, 16);
  const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, ivString);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { value: encrypted, iv: ivString };
};

export const decrypt = (message: string, key: string, iv: string) => {
  const hashedKey = hashFunction(key);
  const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey, iv);
  const partialDecrypt = decipher.update(message, 'base64', 'utf8');
  const decrypted = partialDecrypt + decipher.final('utf8');
  return decrypted;
};
