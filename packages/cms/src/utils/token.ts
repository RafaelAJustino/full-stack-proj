import { GetUser } from "../services/user";

export function setJwtToken(token = '') {
  try {
    console.log('jwt', token)
    localStorage.setItem(import.meta.env.VITE_TOKEN_KEY || 'CMS_DVD_TK', token);
  } catch (error) {
    console.log('jwt', error)
    //
  }
}

export function getJwtToken() {
  try {
    return localStorage.getItem(import.meta.env.VITE_TOKEN_KEY || 'CMS_DVD_TK');
  } catch (error) {
    return null;
  }
}

export function deleteJwtToken() {
  try {
    return localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY || 'CMS_DVD_TK');
  } catch (error) {
    return null;
  }
}

export function setUser(user = '') {
  try {
    console.log('user', user)
    localStorage.setItem(import.meta.env.VITE_USER|| 'VITE_USER', user);
  } catch (error) {
    console.log('user', error)
  }
}

export async function getUser() {
  try {
    if (!!localStorage.getItem(import.meta.env.VITE_USER|| 'VITE_USER')) {
      const tempUser = JSON.parse(localStorage.getItem(import.meta.env.VITE_USER|| 'VITE_USER')!);
      const user = await GetUser(tempUser.id);
      return user;
    }
  } catch (error) {
    return null;
  }
}

export function deleteUser() {
  try {
    return localStorage.removeItem(import.meta.env.VITE_USER|| 'VITE_USER');
  } catch (error) {
    return null;
  }
}