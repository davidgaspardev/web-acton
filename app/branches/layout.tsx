import React from "react";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { Banner } from "./components/Banner";
import Head from "next/head";

type BranchesLayoutProps = {
  children: React.ReactNode;
}

export default function BrancheLayout(props: BranchesLayoutProps) {
  const { children } = props;

  return (
    <main className="pt-16">
      <Head>
        <title>Acto Academia</title>
      </Head>
      <Header />
      <Banner />
      {children}
      <Footer/>
    </main>
  );
}
