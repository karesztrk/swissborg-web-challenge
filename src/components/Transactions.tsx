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
import { RatedTransaction } from '@types/transaction';
import { localizePrice } from '@util/format';
import React, { FC } from 'react';

interface TransactionsProps {
  ratedTransactions: RatedTransaction[];
  symbol: string;
}

const Transactions: FC<TransactionsProps> = ({ ratedTransactions, symbol }) => {
  const renderRow = (tx) => (
    <Tr key={tx.id}>
      <Td>{new Date(tx.timestamp).toLocaleString()}</Td>
      <Td>{tx.currency}</Td>
      <Td isNumeric>{tx.amount}</Td>
      <Td isNumeric>
        {tx.ratedAmount ? (
          `${localizePrice(tx.ratedAmount)} ${symbol}`
        ) : (
          <Tooltip label={`Curreny rate is unavailable for ${tx.currency}`}>
            -
          </Tooltip>
        )}
      </Td>
      <Td textTransform='capitalize'>{tx.type}</Td>
      <Td
        textTransform='capitalize'
        textColor={tx.status === 'pending' ? 'orange.400' : 'green.400'}
      >
        {tx.status}
      </Td>
    </Tr>
  );

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
      <Tbody>{ratedTransactions.map(renderRow)}</Tbody>
    </Table>
  );
};

export default Transactions;
