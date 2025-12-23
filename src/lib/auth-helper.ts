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
