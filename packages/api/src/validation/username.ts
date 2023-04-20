const UsernameFieldName = 'Nome de usuário';

const UsernameValidationErrors = {
  INVALID: `${UsernameFieldName} inválido`,
  TOO_SHORT: `${UsernameFieldName} precisa ter mais que 4 caracteres`,
  TOO_LONG: `${UsernameFieldName} precisa ter menos que 20 caracteres`,
};

type UsernameValidationResult = {
  valid: boolean;
  errors: string[];
};

export function isValidUsername(input = ''): UsernameValidationResult {
  const username = input.trim();
  const errors: string[] = [];

  if (!username)
    return {
      valid: false,
      errors: [UsernameValidationErrors.INVALID],
    };

  if (username.length < 4) {
    errors.push(UsernameValidationErrors.TOO_SHORT);
  }

  if (username.length > 20) {
    errors.push(UsernameValidationErrors.TOO_LONG);
  }

  if (!username.match(/^\w+$/gi) || username.endsWith('_')) {
    errors.push(UsernameValidationErrors.INVALID);
  }

  // return errors

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    errors,
  };
}
