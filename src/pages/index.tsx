import { Link as ChakraLink } from '@chakra-ui/react';
import { Container } from '@components/Container';
import { DarkModeSwitch } from '@components/DarkModeSwitch';
import { Footer } from '@components/Footer';
import { Hero } from '@components/Hero';
import { Main } from '@components/Main';
import Trades from '@components/Trades';
import Transactions from '@components/Transactions';
import {
  RatedTransaction,
  Rates,
  Trades as TradesType,
  Transaction,
} from '@types/transaction';
import Head from 'next/head';

const Index = () => {
  const transactions: Transaction[] = [
    {
      id: '12cc7884-803a-436a-ab4e-506cf7cc9e50',
      timestamp: new Date('2021-03-10T12:00:00.000Z'),
      type: 'withdrawal',
      status: 'completed',
      currency: 'BTC',
      amount: 0.01,
    },
    {
      id: 'fc937bc7-c7e8-4d95-9943-ad85783c63cf',
      timestamp: new Date('2021-03-10T12:00:00.000Z'),
      type: 'withdrawal',
      status: 'completed',
      currency: 'USD',
      amount: 100,
    },
    {
      id: 'b0e7a008-c57f-4ca7-930d-8350bf8c5417',
      timestamp: new Date('2021-03-09T12:00:00.000Z'),
      type: 'deposit',
      status: 'completed',
      currency: 'USD',
      amount: 897,
    },
  ];
  const eurRate: Rates = {
    BTC: 41826.75357546787,
    CHF: null,
    USD: null,
  };
  const eurSymbol = '\u20AC';
  const ratedTransactions: RatedTransaction[] = transactions.map((tx) => {
    const rate = eurRate[tx.currency];
    const ratedAmount = rate && rate * tx.amount;
    return {
      ...tx,
      ratedAmount,
    };
  });
  const trades = ratedTransactions.reduce<TradesType>((acc, cur) => {
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
    if (cur.status === 'completed' && cur.type === 'deposit') {
      trade.completedDeposits += cur.amount;
    } else if (cur.status === 'completed' && cur.type === 'withdrawal') {
      trade.completedWithrawals += cur.amount;
    } else if (cur.status === 'pending' && cur.type === 'deposit') {
      trade.pendingDeposits += cur.amount;
    } else if (cur.status === 'pending' && cur.type === 'withdrawal') {
      trade.pendingWithrawals += cur.amount;
    }
    // Balance
    const balance = trade.completedDeposits - trade.completedWithrawals;
    trade.balance = balance;
    trade.ratedBalance = balance * eurRate[trade.currency];
    return acc;
  }, {});
  return (
    <Container minHeight='100vh'>
      <Head>
        <title>SwissBorg Web Challenge</title>
      </Head>
      <Hero />
      <Main>
        <Transactions
          ratedTransactions={ratedTransactions}
          symbol={eurSymbol}
        />
        <Trades trades={trades} symbol={eurSymbol} />
      </Main>

      <DarkModeSwitch />
      <Footer>
        <ChakraLink isExternal href='https://swissborg.com/'>
          Swissborg
        </ChakraLink>
      </Footer>
    </Container>
  );
};

export default Index;
