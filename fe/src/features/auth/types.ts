export type login = {
  username: string;
  password: string;
};

export type register = {
  username: string;
  password: string;
  role: string;
};

export interface AuthResponse {
  token: string;
  role: string;
}
