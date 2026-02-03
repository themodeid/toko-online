export type login = {
  username: string;
  password: string;
};

export type register = {
  username: string;
  password: string;
  email: string;
};

export interface AuthResponse {
  token: string;
}
