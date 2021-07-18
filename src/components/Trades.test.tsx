import { render, screen } from '@testing-library/react';
import { Trades as TradesType } from '@/types/transaction';
import Trades from './Trades';

describe('Trades', () => {
  it('renders without erros', () => {
    const symbol = '';
    const trades = {} as TradesType;
    render(<Trades symbol={symbol} trades={trades} />);
    expect(screen.getByTestId('trades-table')).toBeInTheDocument();
    expect(screen.getByText('Trades')).toBeInTheDocument();
    expect(screen.getByText('Total completed deposits')).toBeInTheDocument();
    expect(screen.getByText('Total completed withdrawals')).toBeInTheDocument();
    expect(screen.getByText('Total pending deposits')).toBeInTheDocument();
    expect(screen.getByText('Total pending withdrawals')).toBeInTheDocument();
    expect(screen.getByText('Total balance')).toBeInTheDocument();
    expect(screen.getByText('Total balance eur equiv')).toBeInTheDocument();
  });
  it('displays a trade row', () => {
    const symbol = 'eur';
    const currency = 'CHSB';
    const trades: TradesType = {
      CHSB: {
        balance: 1,
        completedDeposits: 2,
        completedWithrawals: 3,
        pendingDeposits: 4,
        pendingWithrawals: 5,
        ratedBalance: 6,
        currency,
      },
    };
    render(<Trades symbol={symbol} trades={trades} />);
    expect(screen.getByTestId('trade-curreny')).toHaveTextContent(
      trades[currency].currency,
    );
    expect(screen.getByTestId('trade-completed-deposits')).toHaveTextContent(
      trades[currency].completedDeposits.toString(),
    );
    expect(screen.getByTestId('trade-completed-withdrawals')).toHaveTextContent(
      trades[currency].completedWithrawals.toString(),
    );
    expect(screen.getByTestId('trade-pending-deposits')).toHaveTextContent(
      trades[currency].pendingDeposits.toString(),
    );
    expect(screen.getByTestId('trade-pending-withdrawals')).toHaveTextContent(
      trades[currency].pendingWithrawals.toString(),
    );
    expect(screen.getByTestId('trade-balance')).toHaveTextContent(
      trades[currency].balance.toString(),
    );
    expect(screen.getByTestId('trade-rated-balance')).toHaveTextContent(
      `${trades[currency].ratedBalance} ${symbol}`,
    );
  });
  it('hides empty rated trades', () => {
    const symbol = 'eur';
    const currency = 'CHSB';
    const trades: TradesType = {
      CHSB: {
        ratedBalance: undefined,
        currency,
        balance: undefined,
        completedDeposits: undefined,
        completedWithrawals: undefined,
        pendingDeposits: undefined,
        pendingWithrawals: undefined,
      },
    };
    render(<Trades symbol={symbol} trades={trades} />);
    expect(screen.getByTestId('trade-rated-balance')).toHaveTextContent('-');
  });
});
