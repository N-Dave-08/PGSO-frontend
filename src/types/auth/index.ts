export interface LoginUser {
  id: number;
  email: string;
  name: string;
  profile: string;
  age: string;
  gender: string;
  number: number;
}

export interface LoginResponse {
  isSuccess: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    profile: string | null;
    age: string;
    gender: string;
    number: number;
  };
  token: string;
  sessionCode: string;
  role: string;
  message: string;
}

export interface AuthHeaders {
  [key: string]: string | undefined;
  Authorization: string;
  "X-Session-Code"?: string;
  "Content-Type": string;
}
