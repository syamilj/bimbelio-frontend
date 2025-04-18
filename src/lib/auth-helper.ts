import Cookies from "js-cookie";
export const signOut = (data?: { callbackUrl?: string }) => {
  const callbackUrl = data?.callbackUrl;
  Cookies.remove("token");
  window.location.pathname = callbackUrl ? callbackUrl : "/";
};

export const signIn = () => {};
