# QuickCrypt 🔐

a CLI tool to quickly store, and retrieve passwords, api keys, and other private stuff.

**🚧Note: this is still WIP and is subject to change🚧**

## Quick Start
Installing quickcrypt is super easy thanks to npm

```bash
npm install -g quickcrypt
quickcrypt --help
```

## Inpsiration

I work with a lot of API keys, database creds, temporary passwords, etc. and traditional password managers don't really seem to fit my use case as they're all GUI based.
I wanted something I could use from within an IDE like VS Code, or PyCharm, and in the terminal.

Quickcrypt is meant to be an exceedingly simple tool to store, and retrieve passwords from the terminal. 
In the future, I may look at options to "export" certain passwords as environment variables, so they can be used in your development environment directly. 

## How's it work

QuickCrypt uses AES256 encryption to securely store your passwords.
All passwords are encrypted using your master password as the key.

**You set your master password the first time you run QuickCrypt, if you forget it say goodbye to your passwords 👋**
