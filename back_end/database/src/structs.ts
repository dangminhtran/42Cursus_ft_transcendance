export interface User {
  id: number
  profilepicture: string,
  email: string
  password: string
  is2FAEnabled: boolean
  twoFASecret?: string
  created_at: string
  updated_at: string
}

export interface UpdateUser {
  email?: string
  password?: string
  is2FAEnabled?: boolean
  twoFASecret?: string
}