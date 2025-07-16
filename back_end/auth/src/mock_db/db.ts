export interface User {
  id: string;
  email: string;
  password: string;
  is2FAEnabled: boolean;
  twoFASecret?: string;
}

export const usersDb = new Map<string, User>();