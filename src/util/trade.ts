import {
  RatedTransaction,
  Rates,
  Transaction,
  Trades as TradesType,
  Trade,
} from '@/types/transaction';

const createBaseTrade = (currency: string) => ({
  currency,
  completedDeposits: 0,
  completedWithrawals: 0,
  pendingDeposits: 0,
  pendingWithrawals: 0,
  balance: 0,
  ratedBalance: 0,
});

export const getRatedTransactions = (
  transactions: Transaction[],
  rates: Rates,
): RatedTransaction[] => {
  if (!transactions) {
    return [];
  }
  return transactions.map((tx) => {
    const rate = rates && rates[tx.currency];
    const ratedAmount = rate && rate * tx.amount;
    return {
      ...tx,
      ratedAmount,
    };
  });
};

enum TxType {
  COMPLETED_DEPOSIT = 'completed_deposit',
  COMPLETED_WITHDRAWAL = 'completed_withdrawal',
  PENDING_DEPOSIT = 'pending_deposit',
  PENDING_WITHDRAWAL = 'pending_withdrawal',
}

const getBalance = (trade: Trade) =>
  trade.completedDeposits - trade.completedWithrawals;

export const getTrades = (
  ratedTransactions: RatedTransaction[],
  rates: Rates,
): TradesType => {
  if (!ratedTransactions) {
    return {};
  }

  return ratedTransactions.reduce<TradesType>((acc, cur) => {
    if (!acc[cur.currency]) {
      acc[cur.currency] = createBaseTrade(cur.currency);
    }
    // Determine the tx type
    const trade = acc[cur.currency];
    const txType = `${cur.status}_${cur.type}` as TxType;
    switch (txType) {
      case TxType.COMPLETED_DEPOSIT: {
        trade.completedDeposits += cur.amount;
        break;
      }
      case TxType.COMPLETED_WITHDRAWAL: {
        trade.completedWithrawals += cur.amount;
        break;
      }
      case TxType.PENDING_DEPOSIT: {
        trade.pendingDeposits += cur.amount;
        break;
      }
      case TxType.PENDING_WITHDRAWAL: {
        trade.pendingWithrawals += cur.amount;
        break;
      }
    }
    // Balance
    const rate = rates && rates[trade.currency];
    const balance = getBalance(trade);
    const ratedBalance = rate && balance * rates[trade.currency];
    trade.balance = balance;
    trade.ratedBalance = ratedBalance;
    return acc;
  }, {});
};
