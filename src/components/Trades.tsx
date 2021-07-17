import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { Trades as TradesType } from '@types/transaction';
import { localizePrice } from '@util/format';
import React from 'react';
import { FC } from 'react';

interface TradesProps {
  trades: TradesType;
  symbol: string;
}

const Trades: FC<TradesProps> = ({ trades, symbol }) => {
  const renderRow = (trade) => {
    const ratedBalanceAvailable = !!trade.ratedBalance;
    const balanceColor = ratedBalanceAvailable
      ? trade.ratedBalance < 0
        ? 'orange.400'
        : 'green.400'
      : undefined;
    return (
      <Tr key={trade.currency}>
        <Td data-testid='trade-curreny'>{trade.currency}</Td>
        <Td data-testid='trade-completed-deposits' isNumeric>
          {localizePrice(trade.completedDeposits)}
        </Td>
        <Td data-testid='trade-completed-withdrawals' isNumeric>
          {localizePrice(trade.completedWithrawals)}
        </Td>
        <Td data-testid='trade-pending-deposits' isNumeric>
          {localizePrice(trade.pendingDeposits)}
        </Td>
        <Td data-testid='trade-pending-withdrawals' isNumeric>
          {localizePrice(trade.pendingWithrawals)}
        </Td>
        <Td data-testid='trade-balance' isNumeric>
          {localizePrice(trade.balance)}
        </Td>
        <Td
          data-testid='trade-rated-balance'
          isNumeric
          textColor={balanceColor}
        >
          {ratedBalanceAvailable ? (
            `${localizePrice(trade.ratedBalance)} ${symbol}`
          ) : (
            <Tooltip
              label={`Curreny rate is unavailable for ${trade.currency}`}
            >
              -
            </Tooltip>
          )}
        </Td>
      </Tr>
    );
  };

  return (
    <Table data-testid='trades-table' variant='simple'>
      <TableCaption>Trades</TableCaption>
      <Thead>
        <Tr>
          <Th>Currency</Th>
          <Th>Total completed deposits</Th>
          <Th>Total completed withdrawals</Th>
          <Th>Total pending deposits</Th>
          <Th>Total pending withdrawals</Th>
          <Th>Total balance</Th>
          <Th>Total balance eur equiv</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(trades)
          .map((key) => trades[key])
          .map(renderRow)}
      </Tbody>
    </Table>
  );
};

export default Trades;
