import Head from "next/head";
import { ReactNode, useState } from "react";

import { Content2 } from "../components/Content/index2";

import ITabs from "../shared/utils/dropdown";

export default function Teste() {
  const { TabsDropDowns } = ITabs;

  return (
    <>
      <Head>
        <title>Teste</title>
      </Head>
      <Content2 contentHeader={TabsDropDowns()}>
        <h2>Hello World</h2>
      </Content2>
   </>
  );
}
