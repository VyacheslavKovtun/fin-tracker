export interface Transaction {
  id: string;
  userId: string;
  categoryId: number;
  amount: number;
  currencyId: number;
  date: Date;
  notes?: string;
}