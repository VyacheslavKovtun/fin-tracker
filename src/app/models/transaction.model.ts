export interface Transaction {
  id: string;
  userId: string;
  categoryId: number;
  amount: number;
  currencyCode: string;
  date: Date;
  notes?: string;
}