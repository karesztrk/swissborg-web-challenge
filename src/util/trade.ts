import {
  RatedTransaction,
  Rates,
  Transaction,
  Trades as TradesType,
} from '@types/transaction';

export const getRatedTransactions = (
  transactions: Transaction[],
  rates: Rates,
): RatedTransaction[] =>
  transactions.map((tx) => {
    const rate = rates[tx.currency];
    const ratedAmount = rate && rate * tx.amount;
    return {
      ...tx,
      ratedAmount,
    };
  });

const idCompletedDeposit = (tx: RatedTransaction) =>
  tx.status === 'completed' && tx.type === 'deposit';

const idCompletedWithdrawal = (tx: RatedTransaction) =>
  tx.status === 'completed' && tx.type === 'withdrawal';

const idPendingDeposit = (tx: RatedTransaction) =>
  tx.status === 'pending' && tx.type === 'deposit';

const idPendingWithdrawal = (tx: RatedTransaction) =>
  tx.status === 'pending' && tx.type === 'withdrawal';

export const getTrades = (
  ratedTransactions: RatedTransaction[],
  rates: Rates,
) =>
  ratedTransactions.reduce<TradesType>((acc, cur) => {
    if (!acc[cur.currency]) {
      acc[cur.currency] = {
        currency: cur.currency,
        completedDeposits: 0,
        completedWithrawals: 0,
        pendingDeposits: 0,
        pendingWithrawals: 0,
        balance: 0,
        ratedBalance: 0,
      };
    }

    const trade = acc[cur.currency];
    if (idCompletedDeposit(cur)) {
      trade.completedDeposits += cur.amount;
    } else if (idCompletedWithdrawal(cur)) {
      trade.completedWithrawals += cur.amount;
    } else if (idPendingDeposit(cur)) {
      trade.pendingDeposits += cur.amount;
    } else if (idPendingWithdrawal(cur)) {
      trade.pendingWithrawals += cur.amount;
    }
    // Balance
    const balance = trade.completedDeposits - trade.completedWithrawals;
    trade.balance = balance;
    trade.ratedBalance = balance * rates[trade.currency];
    return acc;
  }, {});
