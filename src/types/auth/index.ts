export interface LoginUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
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
    first_name: string;
    last_name: string;
    avatar: string | null;
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
