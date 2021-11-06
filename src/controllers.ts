// external deps
import { Low } from 'lowdb/lib';
import inquirer from 'inquirer';
// internal deps
import { initDb } from './modules/db.js';
import { encrypt, decrypt } from './modules/encryption.js';
import { authenticate, checkAuthenticated, createMasterPassword } from './modules/auth.js';

export const isAuthenticated = async (next: Function, params: Array<any> = []) => {
  const db: Low<any> = await initDb();
  // check if authed in the last 5 minutes
  const isAuthed = await checkAuthenticated()
  if(isAuthed) {
    next(...params);
    return;
  }
  // check if the user has a password.
  const hasPassword = db.data.meta.passHash != null;
  // if the user does have a password, auth as normal
  if (hasPassword) {
    const { masterPass } = await inquirer.prompt([
      { type: 'password', name: 'masterPass', message: 'Master Password: ' },
    ]);
    const result = await authenticate(masterPass);
    if (result.state == 'success') next(...params);
    if (result.state == 'failed') console.log('wrong password. try again!');
    return;
  } else {
    console.log('no master password found, lets create one...');
    const { newPass } = await inquirer.prompt([
      { type: 'password', name: 'newPass', message: 'New Password: ' },
    ]);
    createMasterPassword(newPass);
  }
};

export const createPassword = async () => {
  const db: Low<any> = await initDb();

  console.log(`creating a new password`);
  const answers = await inquirer.prompt([
    { type: 'input', name: 'passName', message: 'Password Name: ' },
    { type: 'input', name: 'passVal', message: 'Password: ' },
    {
      type: 'input',
      name: 'passValRepeat',
      message: 'Repeat Password: ',
    },
  ]);
  const { value: encryptedPass, iv } = encrypt(answers.passVal, 'test-test');
  db.data.passwords.push({ key: answers.passName, value: encryptedPass, iv });
  await db.write();
  console.log('Password created!');
  return;
};

export const listAllPasswords = async () => {
  const db: Low<any> = await initDb();
  // get a list of passwords
  const passwordList =
    db.data.passwords.map(
      (password: { key: string; value: string; iv: string }) => ({
        name: password.key,
        value: { value: password.value, iv: password.iv },
      })
    ) || [];
  // check if the list is empty
  if (passwordList.length == 0) {
    console.log('You have no passwords! create one');
    return;
  }
  // get the selected password
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'password',
      message: 'select a password',
      choices: passwordList,
    },
  ]);
  // decode the password
  const password = decrypt(
    answers.password.value,
    'test-test',
    answers.password.iv
  );
  console.log(password);
  return;
};

export const getPasswordByKey = async (key: string) => {
  const db: Low<any> = await initDb();
  try {
    const passIdx = db.data.passwords.findIndex((pw: any) => pw.key === key);
    const { value, iv } = db.data.passwords[passIdx];
    const decryptedPass = decrypt(value, 'test-test', iv);
    console.log(decryptedPass);
  } catch (err) {
    console.log('no such password exists. try listing all passwords with -lp');
  }
};

export const deletePasswordByKey = async (key: string) => {
  // TODO: delete a password
  const db: Low<any> = await initDb();
};
