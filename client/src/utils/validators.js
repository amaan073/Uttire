export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const minLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const noSpaces = !/\s/.test(password); // Disallow any whitespace

  return minLength && hasLetter && hasNumber && noSpaces;    //return true if all of them true
};

export function isValidLoginPassword(password) {
  const minLength = password.length >= 6;
  return minLength;
}

export const isValidName = (name) => {
   // Only letters, at least 2 characters
  const trimmed = name.trim();
  const onlyLetters = /^[a-zA-Z\s]+$/.test(trimmed);
  return trimmed.length >= 2 && onlyLetters;
};
