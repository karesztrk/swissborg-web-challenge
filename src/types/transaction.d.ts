export type Status = 'pending' | 'completed';

export type Type = 'deposit' | 'withdrawal';

export interface Transaction {
  id: string;
  timestamp: Date;
  type: Type;
  status: Status;
  currency: string;
  amount: number;
}

export interface RatedTransaction extends Transaction {
  ratedAmount: number;
}

export interface Rates {
  [key: string]: number;
}

export interface Trades {
  [key: string]: {
    currency: string;
    completedDeposits: number;
    completedWithrawals: number;
    pendingDeposits: number;
    pendingWithrawals: number;
    balance: number;
    ratedBalance: number;
  };
}
