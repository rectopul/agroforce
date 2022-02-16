import { MainHeader } from "../components/MainHeader";
import { Aside } from "../components/Aside";
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <MainHeader />
      <div className='flex flex-row'>
        <Aside />
      </div>
    </>
  );
}
