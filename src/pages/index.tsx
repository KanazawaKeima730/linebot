import Head from "next/head";
import type { NextPage } from "next";
import { Header } from "../components/header";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TaxPal - Accounting made simple for small businesses</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
};

export default Home;
