import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import { FC } from 'react';
import { RatedTransaction } from '@types/transaction';
import { localizePrice } from '@util/index';

interface TransactionsProps {
  ratedTransactions: RatedTransaction[];
  symbol: string;
}

const Transactions: FC<TransactionsProps> = ({ ratedTransactions, symbol }) => {
  return (
    <Table variant='simple'>
      <TableCaption>Transactions</TableCaption>
      <Thead>
        <Tr>
          <Th>Timestamp</Th>
          <Th>Currency</Th>
          <Th isNumeric>Amount</Th>
          <Th isNumeric>Eur equiv</Th>
          <Th>Type</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {ratedTransactions.map((tx) => (
          <Tr key={tx.id}>
            <Td>{tx.timestamp.toLocaleString()}</Td>
            <Td>{tx.currency}</Td>
            <Td isNumeric>{tx.amount}</Td>
            <Td isNumeric>
              {tx.ratedAmount
                ? `${localizePrice(tx.ratedAmount)} ${symbol}`
                : '-'}
            </Td>
            <Td textTransform='capitalize'>{tx.type}</Td>
            <Td textTransform='capitalize'>{tx.status}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Transactions;
