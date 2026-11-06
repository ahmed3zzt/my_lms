export interface AuthUser {
  id: string
  email: string
}

export interface IAuthService {
  getCurrentUser(): Promise<AuthUser | null>
  signIn(email: string, password: string): Promise<AuthUser>
  signOut(): Promise<void>
  onAuthStateChange(callback: (user: AuthUser | null) => void): { unsubscribe: () => void }
}
