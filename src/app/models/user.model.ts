export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  preferredCurrencyCode: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt?: Date;

  isEmailConfirmed: boolean;
  emailConfirmationToken?: string;
}
