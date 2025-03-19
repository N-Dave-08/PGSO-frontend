export interface LoginResponse {
  isSuccess: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    profile_img: string | null;
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
