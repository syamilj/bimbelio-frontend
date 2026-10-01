import Cookies from 'js-cookie';
export const signOut = (data?: { callbackUrl?: string }) => {
  const callbackUrl = data?.callbackUrl;
  Cookies.remove('token');
  Cookies.remove('g_state');
  const pathname = window.location.pathname;
  if (pathname === callbackUrl) {
    window.location.reload();
  } else {
    window.location.pathname = callbackUrl ? callbackUrl : '/';
  }
};

export const signIn = () => {};

// Matches the backend JWT lifetime (`expiresIn: '7d'`).
const AUTH_TOKEN_EXPIRES_DAYS = 7;

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, {
    secure: window.location.protocol === 'https:',
    sameSite: 'lax',
    expires: AUTH_TOKEN_EXPIRES_DAYS,
  });
};

export const getAuthToken = () => Cookies.get('token');

/** Header Authorization untuk request langsung (axios/fetch tanpa instance utama). */
export const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
