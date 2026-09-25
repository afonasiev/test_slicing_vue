export { validateDocument } from './service';
export const documentTypes = [
  { id: 'passport', label: 'Passaporto' },
  { id: 'identity', label: "Carta d'identità" },
  { id: 'license', label: 'Patente di guida' },
] as const;
export { normalizeIban, isValidIban } from './iban';
