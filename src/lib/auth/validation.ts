export function validateEmail(
  email: string,
): string | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "Email is required.";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePassword(
  password: string,
): string | null {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
}
export function validateCredentials(
  email: string,
  password: string,
): string | null {
  const emailError = validateEmail(email);

  if (emailError) {
    return emailError;
  }

  const passwordError =
    validatePassword(password);

  if (passwordError) {
    return passwordError;
  }

  return null;
}