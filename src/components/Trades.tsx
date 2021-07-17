import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Trades as TradesType } from '@types/transaction';
import { localizePrice } from '@util/index';
import React from 'react';
import { FC } from 'react';

interface TradesProps {
  trades: TradesType;
  symbol: string;
}

const Trades: FC<TradesProps> = ({ trades, symbol }) => {
  return (
    <Table variant='simple'>
      <TableCaption>Trades</TableCaption>
      <Thead>
        <Tr>
          <Th>Currency</Th>
          <Th>Total completed deposits</Th>
          <Th>Total completed withdrawals</Th>
          <Th>Total pending withdrawals</Th>
          <Th>Total pending deposits</Th>
          <Th>Total balance</Th>
          <Th>Total balance eur equiv</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(trades)
          .map((key) => trades[key])
          .map((trade) => {
            return (
              <Tr key={trade.currency}>
                <Td>{trade.currency}</Td>
                <Td isNumeric>{localizePrice(trade.completedDeposits)}</Td>
                <Td isNumeric>{localizePrice(trade.completedWithrawals)}</Td>
                <Td isNumeric>{localizePrice(trade.pendingDeposits)}</Td>
                <Td isNumeric>{localizePrice(trade.pendingWithrawals)}</Td>
                <Td isNumeric>{localizePrice(trade.balance)}</Td>
                <Td isNumeric>{`${localizePrice(
                  trade.ratedBalance,
                )} ${symbol}`}</Td>
              </Tr>
            );
          })}
      </Tbody>
    </Table>
  );
};

export default Trades;
