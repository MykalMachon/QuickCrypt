// TODO: handles inputs and the "interface" portion of the app
import { Command } from 'commander';
import inquirer from 'inquirer';
import { Low } from 'lowdb/lib';
import { initDb } from './modules/db.js';
import { decrypt, encrypt } from './modules/encryption.js';

const program = new Command();

program
  .option('-l --login', 'you should login...')
  .option('-p --password <name>', 'this should list a password')
  .option('-lp --list-passwords', 'this should list all passwords')
  .option('-cp --create-password', 'this should input a new password');

program.parse(process.argv);

const options = program.opts();

const handleInputs = async (options: any) => {
  const db: Low<any> = await initDb();

  if (options.password) {
    console.log('fetching a password...');
  }

  if (options.listPasswords) {
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
    const password = decrypt(answers.password.value, 'test-test', answers.password.iv);
    console.log(password);
  }

  if (options.createPassword) {
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
  }
};

handleInputs(options);
