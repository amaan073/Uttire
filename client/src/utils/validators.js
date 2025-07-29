export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const minLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return minLength && hasLetter && hasNumber;    //return true if all of them true
};

export function isValidLoginPassword(password) {
  const minLength = password.length >= 6;

  return minLength;
}


export const isValidName = (name) => {
  return name.trim().length >= 2;
};
