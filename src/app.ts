#!/usr/bin/env node

// TODO: handles inputs and the "interface" portion of the app
import { Command } from 'commander';
import {
  getPasswordByKey,
  listAllPasswords,
  createPassword,
  isAuthenticated,
} from './controllers.js';

const program = new Command();

program
  .option('-p --password <name>', 'this should list a password')
  .option('-lp --list-passwords', 'this should list all passwords')
  .option('-cp --create-password', 'this should input a new password');

program.parse(process.argv);

const options = program.opts();

if (options.password) isAuthenticated(getPasswordByKey, [options.password]);
if (options.listPasswords) isAuthenticated(listAllPasswords);
if (options.createPassword) isAuthenticated(createPassword);
if (Object.keys(options).length == 0) program.outputHelp();
