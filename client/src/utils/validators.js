export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const minLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const noSpaces = !/\s/.test(password); // Disallow any whitespace

  return minLength && hasLetter && hasNumber && noSpaces; //return true if all of them true
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

// ✅ Phone number validator
export const isValidPhone = (phone) => {
  const trimmed = phone.trim();
  // Only digits, 10–15 characters (supports most international formats)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(trimmed);
};

export const isValidZip = (zip) => {
  const trimmed = zip.trim();
  return /^\d{4,10}$/.test(trimmed);
};

export const isValidSearch = (query) => {
  if (!query) return false; // empty input
  const trimmed = query.trim();
  if (trimmed.length === 0) return false; // only spaces
  if (trimmed.length > 50) return false; // max length

  // Regex: only allow letters, numbers, spaces, - _ . '
  const validPattern = /^[a-zA-Z0-9\s\-_.']+$/;
  if (!validPattern.test(trimmed)) return false;

  return true;
};
