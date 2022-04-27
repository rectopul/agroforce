import Head from "next/head";
import { ReactNode, useState } from "react";

import { Content } from "../components/Content/index";

import ITabs from "../shared/utils/dropdown";

export default function Teste() {
  const { TabsDropDowns } = ITabs;

  return (
    <>
      <Head>
        <title>Teste</title>
      </Head>
      <Content contentHeader={TabsDropDowns()}>
        <h2>Hello World</h2>
      </Content>
   </>
  );
}
