// external deps
import { Low } from 'lowdb/lib';
import inquirer from 'inquirer';
// internal deps
import { initDb } from './modules/db.js';
import { encrypt, decrypt } from './modules/encryption.js';
import { authenticate, createMasterPassword } from './modules/auth.js';

export const isAuthenticated = async (
  next: Function,
  params: Array<any> = []
) => {
  const db: Low<any> = await initDb();
  // check if the user has a password.
  const hasPassword = db.data.meta.passHash != null;
  // if the user does have a password, auth as normal
  if (hasPassword) {
    const { masterPass } = await inquirer.prompt([
      { type: 'password', name: 'masterPass', message: 'Master Password: ' },
    ]);
    const result = await authenticate(masterPass);
    if (result.state == 'success') next(masterPass, ...params);
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

export const createPassword = async (encryptKey: string) => {
  const db: Low<any> = await initDb();

  console.log(`creating a new password`);
  const answers = await inquirer.prompt([
    { type: 'input', name: 'passName', message: 'Password Name: ' },
    { type: 'password', name: 'passVal', message: 'Password: ' },
    {
      type: 'password',
      name: 'passValRepeat',
      message: 'Repeat Password: ',
    },
  ]);
  if(answers.passVal != answers.passValRepeat){
    console.log("passowrds don't match, try again!")
    createPassword(encryptKey);
    return; 
  }
  const { value: encryptedPass, iv } = encrypt(answers.passVal, encryptKey);
  db.data.passwords.push({ key: answers.passName, value: encryptedPass, iv });
  await db.write();
  console.log('Password created!');
};

export const listAllPasswords = async (encryptKey: string) => {
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
    encryptKey,
    answers.password.iv
  );
  console.log(password);
  return;
};

export const getPasswordByKey = async (encryptKey: string, key: string) => {
  const db: Low<any> = await initDb();
  try {
    const passIdx = db.data.passwords.findIndex((pw: any) => pw.key === key);
    const { value, iv } = db.data.passwords[passIdx];
    const decryptedPass = decrypt(value, encryptKey, iv);
    console.log(decryptedPass);
  } catch (err) {
    console.log('no such password exists. try listing all passwords with -lp');
  }
};

export const deletePasswordByKey = async (key: string) => {
  // TODO: delete a password
  const db: Low<any> = await initDb();
};
