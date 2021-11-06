import crypto from 'crypto';
import { Low } from 'lowdb/lib';
import { initDb } from './db.js';

const passHashFunction = (key: string) => {
  const hasher = crypto.createHash('sha512');
  hasher.update(key);
  return hasher.digest('hex');
};

// Types needed for module
type FailedAuth = {
  state: 'failed';
};

type SuccessfulAuth = {
  state: 'success';
};

export const createMasterPassword = async (newPass: string) => {
  const db: Low<any> = await initDb();
  if (!db.data.meta.passHash) {
    // Hash the password
    const newPassHash = passHashFunction(newPass);
    // write it to the database
    db.data.meta = { ...db.data.meta, passHash: newPassHash };
    await db.write();
  }
};

/**
 * authenticates the user
 * @param provided the provided password from the user
 * @returns state object defining success type
 */
export const authenticate = async (
  provided: string
): Promise<SuccessfulAuth | FailedAuth> => {
  const db: Low<any> = await initDb();
  // Hash the password
  const providedHash = passHashFunction(provided);
  // Fetch hashed password from storage (if NA, create password)
  try {
    // TODO: fetch password using lowdb
    if (providedHash == db.data.meta.passHash) {
      db.data.meta = { ...db.data.meta, lastLogin: new Date() };
      await db.write();
      return { state: 'success' };
    }
    return { state: 'failed' };
  } catch (err) {
    return { state: 'failed' };
  }
};

/**
 * checks if authenticated within the last 5 minutes.
 * @returns true if lastLogin was <= 5 minutes ago.
 */
export const checkAuthenticated = async () => {
  // 1. Read login time from storage
  const db: Low<any> = await initDb();
  const lastLogin = new Date(db.data.meta.lastLogin);
  // 2. if login time is greater than 5 minutes ago, authenticate
  const timeDiff = new Date().getMilliseconds() - lastLogin.getMilliseconds();
  const timeDiffInMinutes = Math.floor(timeDiff / 1000 / 60);
  // 3. return true
  return timeDiffInMinutes <= 5;
};
