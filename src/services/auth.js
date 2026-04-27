export const saveToken = (t) => localStorage.setItem("token", t);
export const getToken = () => localStorage.getItem("token");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
export const isAuthenticated = () => !!localStorage.getItem("token");