export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const clearToken = (): void => {
  localStorage.removeItem("token");
};
