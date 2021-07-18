import { render, screen } from '@testing-library/react';
import { RatedTransaction } from '@/types/transaction';
import Transactions from './Transactions';

describe('Transactions', () => {
  it('renders without erros', () => {
    const symbol = '';
    const transactions = [];
    render(<Transactions symbol={symbol} ratedTransactions={transactions} />);
    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Eur equiv')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
  it('displays a trade row', () => {
    const symbol = 'eur';
    const currency = 'CHSB';
    const transactions: RatedTransaction[] = [
      {
        id: '12345',
        amount: 1,
        currency,
        ratedAmount: 2,
        status: 'completed',
        timestamp: new Date().toISOString(),
        type: 'deposit',
      },
    ];
    render(<Transactions symbol={symbol} ratedTransactions={transactions} />);
    expect(screen.getByTestId('transaction-timestamp')).toHaveTextContent(
      new Date(transactions[0].timestamp).toLocaleString(),
    );
    expect(screen.getByTestId('transaction-currency')).toHaveTextContent(
      transactions[0].currency,
    );
    expect(screen.getByTestId('transaction-amount')).toHaveTextContent(
      transactions[0].amount,
    );
    expect(screen.getByTestId('transaction-rated-amount')).toHaveTextContent(
      `${transactions[0].ratedAmount} ${symbol}`,
    );
    expect(screen.getByTestId('transaction-type')).toHaveTextContent(
      transactions[0].type,
    );
    expect(screen.getByTestId('transaction-status')).toHaveTextContent(
      transactions[0].status,
    );
  });
  it('hides empty rated trades', () => {
    const symbol = 'eur';
    const currency = 'CHSB';
    const transactions: RatedTransaction[] = [
      {
        id: '12345',
        amount: 1,
        currency,
        ratedAmount: undefined,
        status: 'completed',
        timestamp: new Date().toISOString(),
        type: 'deposit',
      },
    ];
    render(<Transactions symbol={symbol} ratedTransactions={transactions} />);
    expect(screen.getByTestId('transaction-rated-amount')).toHaveTextContent(
      '-',
    );
  });
});
