import {
  RatedTransaction,
  Rates,
  Trades,
  Transaction,
} from '@/types/transaction';
import { getRatedTransactions, getTrades } from './trade';

describe('trade', () => {
  describe('getRatedTransactions', () => {
    it('handles empty input', () => {
      let ratedTransactions = getRatedTransactions([], {});
      expect(ratedTransactions).toStrictEqual([]);

      ratedTransactions = getRatedTransactions(undefined, {});
      expect(ratedTransactions).toStrictEqual([]);
    });
    it('handles empty rates', () => {
      const transactions: Transaction[] = [
        {
          amount: 1,
          currency: 'BTC',
          id: '12345',
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
      ];
      let ratedTransactions: RatedTransaction[] = getRatedTransactions(
        transactions,
        undefined,
      );
      expect(ratedTransactions).toHaveLength(1);
      expect(ratedTransactions[0].ratedAmount).toBeUndefined();
      expect(ratedTransactions[0].amount).toBe(transactions[0].amount);
      expect(ratedTransactions[0].currency).toBe(transactions[0].currency);
      expect(ratedTransactions[0].status).toBe(transactions[0].status);
      expect(ratedTransactions[0].id).toBe(transactions[0].id);
      expect(ratedTransactions[0].type).toBe(transactions[0].type);
      expect(ratedTransactions[0].timestamp).toBe(transactions[0].timestamp);

      const rates: Rates = {
        BTC: null,
      };
      ratedTransactions = getRatedTransactions(transactions, rates);
      expect(ratedTransactions).toHaveLength(1);
      expect(ratedTransactions[0].ratedAmount).toBeNull();
      expect(ratedTransactions[0].amount).toBe(transactions[0].amount);
      expect(ratedTransactions[0].currency).toBe(transactions[0].currency);
      expect(ratedTransactions[0].status).toBe(transactions[0].status);
      expect(ratedTransactions[0].id).toBe(transactions[0].id);
      expect(ratedTransactions[0].type).toBe(transactions[0].type);
      expect(ratedTransactions[0].timestamp).toBe(transactions[0].timestamp);
    });
    it('applies rates', () => {
      const currency = 'BTC';
      const rates: Rates = {
        BTC: 2,
        ETH: 3,
      };
      const transactions: Transaction[] = [
        {
          amount: 10,
          currency,
          id: '12345',
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
      ];
      const ratedTransactions: RatedTransaction[] = getRatedTransactions(
        transactions,
        rates,
      );
      expect(ratedTransactions).toHaveLength(1);
      expect(ratedTransactions[0].ratedAmount).toBe(
        transactions[0].amount * rates[currency],
      );
    });
  });
  describe('getTrades', () => {
    it('handles empty input', () => {
      let ratedTransactions = getTrades([], {});
      expect(ratedTransactions).toStrictEqual({});
    });
    it('handles empty rates', () => {
      const currency = 'BTC';
      const transactions: RatedTransaction[] = [
        {
          amount: 1,
          currency,
          id: '12345',
          ratedAmount: 10,
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
      ];
      let trades: Trades = getTrades(transactions, undefined);
      expect(trades[currency]).toBeTruthy();
      expect(trades[currency].ratedBalance).toBeUndefined();
      expect(trades[currency].balance).toBe(transactions[0].amount);
      expect(trades[currency].completedDeposits).toBe(transactions[0].amount);
      expect(trades[currency].completedWithrawals).toBe(0);
      expect(trades[currency].pendingDeposits).toBe(0);
      expect(trades[currency].pendingWithrawals).toBe(0);
      expect(trades[currency].currency).toBe(currency);

      const rates: Rates = {
        BTC: null,
      };
      trades = getTrades(transactions, rates);
      expect(trades[currency]).toBeTruthy();
      expect(trades[currency].ratedBalance).toBeNull();
      expect(trades[currency].balance).toBe(transactions[0].amount);
      expect(trades[currency].completedDeposits).toBe(transactions[0].amount);
      expect(trades[currency].completedWithrawals).toBe(0);
      expect(trades[currency].pendingDeposits).toBe(0);
      expect(trades[currency].pendingWithrawals).toBe(0);
      expect(trades[currency].currency).toBe(currency);
    });
    it('applies rates', () => {
      const rates: Rates = {
        BTC: 2,
        ETH: 3,
      };
      const currency = 'BTC';
      const transactions: RatedTransaction[] = [
        {
          amount: 1,
          currency,
          id: '12345',
          ratedAmount: 10,
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
      ];
      const trades: Trades = getTrades(transactions, rates);
      expect(trades[currency]).toBeTruthy();
      expect(trades[currency].ratedBalance).toBe(
        rates[currency] * transactions[0].amount,
      );
    });
    it('groups by currency', () => {
      const rates: Rates = {
        BTC: 2,
        ETH: 3,
      };
      const currency = 'BTC';
      const transactions: RatedTransaction[] = [
        {
          amount: Math.random(),
          currency,
          id: '123451',
          ratedAmount: undefined,
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
        {
          amount: Math.random(),
          currency,
          id: '123452',
          ratedAmount: undefined,
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'withdrawal',
        },
        {
          amount: Math.random(),
          currency,
          id: '123453',
          ratedAmount: undefined,
          status: 'pending',
          timestamp: new Date().toISOString(),
          type: 'deposit',
        },
        {
          amount: Math.random(),
          currency,
          id: '123454',
          ratedAmount: undefined,
          status: 'pending',
          timestamp: new Date().toISOString(),
          type: 'withdrawal',
        },
      ];
      const trades: Trades = getTrades(transactions, rates);
      expect(trades[currency]).toBeTruthy();
      expect(trades[currency].completedDeposits).toBe(transactions[0].amount);
      expect(trades[currency].completedWithrawals).toBe(transactions[1].amount);
      expect(trades[currency].pendingDeposits).toBe(transactions[2].amount);
      expect(trades[currency].pendingWithrawals).toBe(transactions[3].amount);
      expect(trades[currency].balance).toBe(
        trades[currency].completedDeposits -
          trades[currency].completedWithrawals,
      );
      expect(trades[currency].ratedBalance).toBe(
        trades[currency].balance * rates[currency],
      );
    });
  });
});
