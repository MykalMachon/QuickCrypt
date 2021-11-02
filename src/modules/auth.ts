import crypto from 'crypto';

const passHashFunction = (key: string) => {
  const hasher = crypto.createHash('sha512');
  hasher.update(key);
  return hasher.digest('hex');
}

// Types needed for module
type FailedAuth = {
  state: 'failed'
}

type NoUser = {
  state: 'no_user'
}

type SuccessfulAuth = {
  state: 'success'
}

// Module Functions
export const createPassword = (newPass: string) => {
  // Hash the password
  const hashPass = passHashFunction(newPass);
  // store the password locally
  // TODO: store the password using lowdb
}

export const authenticate = (password: string): SuccessfulAuth | FailedAuth | NoUser  => {
  // Hash the password
  const hashPass = passHashFunction(password);
  // Fetch hashed password from storage (if NA, create password)
  try{
    // TODO: fetch password using lowdb
    const fetchedPass = 'some-shit';
    if(hashPass == fetchedPass){ 
      // TODO: set login time in storage
      return { state: 'success' }
    }
    return {state: 'failed'}
  }catch(err){
    return {state: 'no_user'}
  }
}

export const checkAuthenticated = () => {
  // 1. Read login time from storage
  // 2. if login time is greater than 5 minutes ago, authenticate
  // 3. return true
}