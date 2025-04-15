import Cookies from "js-cookie";
export const signOut = () => {
  Cookies.remove("token");
  window.location.pathname = "/";
};

export const signIn = () => {};
