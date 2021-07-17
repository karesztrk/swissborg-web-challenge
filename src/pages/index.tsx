import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Container } from '../components/Container';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { Main } from '../components/Main';

interface Transaction {
  id: string;
  timestamp: Date;
  type: string;
  status: string;
  currency: string;
  amount: number;
}

const Index = () => {
  const transactions: Transaction[] = [
    {
      id: '12cc7884-803a-436a-ab4e-506cf7cc9e50',
      timestamp: new Date('2021-03-10T12:00:00.000Z'),
      type: 'withdrawal',
      status: 'pending',
      currency: 'BTC',
      amount: 0.01,
    },
  ];
  return (
    <Container height='100vh'>
      <Hero />
      <Main>
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
            {transactions.map((tx) => (
              <Tr key={tx.id}>
                <Td>{tx.timestamp.toLocaleString()}</Td>
                <Td>{tx.currency}</Td>
                <Td isNumeric>{tx.amount}</Td>
                <Td isNumeric></Td>
                <Td textTransform='capitalize'>{tx.type}</Td>
                <Td textTransform='capitalize'>{tx.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>SwissBorg</Text>
      </Footer>
    </Container>
  );
};

export default Index;
