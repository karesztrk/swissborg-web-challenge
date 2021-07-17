import {
  RatedTransaction,
  Rates,
  Transaction,
  Trades as TradesType,
  Trade,
} from '@types/transaction';

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

const getBalance = (trade: Trade) =>
  trade.completedDeposits - trade.completedWithrawals;

const getRatedBalance = (balance: number, rate: number) => balance * rate;

export const getTrades = (
  ratedTransactions: RatedTransaction[],
  rates: Rates,
) =>
  ratedTransactions.reduce<TradesType>((acc, cur) => {
    if (!acc[cur.currency]) {
      acc[cur.currency] = createBaseTrade(cur.currency);
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
    const balance = getBalance(trade);
    const ratedBalance = getRatedBalance(balance, rates[trade.currency]);
    trade.balance = balance;
    trade.ratedBalance = ratedBalance;
    return acc;
  }, {});
