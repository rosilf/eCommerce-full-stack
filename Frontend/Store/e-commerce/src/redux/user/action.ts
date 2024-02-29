import { USER_LOGIN, USER_LOGOUT } from "./types";

export const userLogIn = (username: string) => {
  return {
    type: USER_LOGIN,
    payload: username,
  };
};

export const userLogOut = () => {
  return {
    type: USER_LOGOUT,
  };
}
