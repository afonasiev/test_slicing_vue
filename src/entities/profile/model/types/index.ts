export interface Profile {
  name: string;
  surname: string;
  email: string;
  approvedAmount: string;
  documentType: string;
  documentNumber: string;
  iban: string | null;
  emailVerified: boolean;
}
export interface ProfileService {
  load(): Promise<Profile>;
  update(data: Partial<Pick<Profile, 'name' | 'email'>>): Promise<Profile>;
  changePassword(password: string): Promise<void>;
  verifyEmail(code: string): Promise<Profile>;
  resendCode(): Promise<void>;
}
