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

export interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
}