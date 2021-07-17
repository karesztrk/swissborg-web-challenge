import { Alert, AlertIcon, Link as ChakraLink } from '@chakra-ui/react';
import { Container } from '@components/Container';
import { DarkModeSwitch } from '@components/DarkModeSwitch';
import { Footer } from '@components/Footer';
import { Hero } from '@components/Hero';
import { Main } from '@components/Main';
import Trades from '@components/Trades';
import Transactions from '@components/Transactions';
import { Rates, Transaction } from '@types/transaction';
import { getRatedTransactions, getTrades } from '@util/trade';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';

interface IndexProps {
  transactions: Transaction[];
  eurRate: Rates;
}
const eurSymbol = '\u20AC';

const Index: FC<IndexProps> = ({ transactions = [], eurRate = {} }) => {
  const ratedTransactions = getRatedTransactions(transactions, eurRate);
  const trades = getTrades(ratedTransactions, eurRate);
  const renderContent = () => {
    return (
      <>
        <Transactions
          ratedTransactions={ratedTransactions}
          symbol={eurSymbol}
        />
        <Trades trades={trades} symbol={eurSymbol} />
      </>
    );
  };

  const renderEmptyContent = () => (
    <Alert status='warning'>
      <AlertIcon />
      Ooops, no transactions found. Please try again later...
    </Alert>
  );

  return (
    <Container minHeight='100vh'>
      <Head>
        <title>SwissBorg Web Challenge</title>
      </Head>
      <Hero />
      <Main>
        {transactions && transactions.length > 0
          ? renderContent()
          : renderEmptyContent()}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const txResponse = await fetch('http://localhost:8080/api/transactions');
    const txResult = await txResponse.json();
    const transactions = txResult?.transactions;

    const rateResponse = await fetch('http://localhost:8080/api/eur-rates');
    const eurRate = await rateResponse.json();
    return {
      props: {
        transactions,
        eurRate,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
};

export default Index;
