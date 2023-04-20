import Api from '.';

interface Auth {
    email: string;
    password: string;
}

interface AuthRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const AuthUser = async (model: Auth) => {
  const { data } = await Api.post('/auth/login', model);
  return data;
};

export const AuthRegister = async (model: AuthRegister) => {
  const { data } = await Api.post('/auth/register', model);
  return data;
};