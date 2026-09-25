export interface AccountSession {
  email: string;
}
export interface AccountService {
  enter(email: string): Promise<AccountSession>;
}
