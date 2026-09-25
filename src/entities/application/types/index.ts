export interface ApplicationData {
  amount: number;
  months: number;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  documentType: string;
  documentNumber: string;
}
export interface ApplicationService {
  load(): Promise<ApplicationData>;
  update(data: Partial<ApplicationData>): Promise<ApplicationData>;
}
