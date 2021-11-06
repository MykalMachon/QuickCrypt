// TODO: handles inputs and the "interface" portion of the app
import { Command } from 'commander';
import {initDb} from './modules/db.js'

const program = new Command();
const db = initDb();

program
  .option('-l --login', 'you should login...')
  .option('-p --password <name>', 'this should list a password')
  .option('-np --new-password <name>', 'this should input a new password');

program.parse(process.argv);

const options = program.opts();
if (options.login) console.log(options);

if(options.newPassword){
  console.log('creating a new password')
  console.log(options)
}