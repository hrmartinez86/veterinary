const ACCESS_TOKEN_KEY = 'vetcare_access_token';
const USER_KEY = 'vetcare_user';
const AUTH_EVENT = 'vetcare-auth-changed';

function hasWindow() {
  return typeof window !== 'undefined';
}

function emitAuthChange() {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken() {
  if (!hasWindow()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser() {
  if (!hasWindow()) return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession({ accessToken, user }) {
  if (!hasWindow()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function clearSession() {
  if (!hasWindow()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  emitAuthChange();
}

export function onAuthChange(handler) {
  if (!hasWindow()) return () => {};

  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}