import { MainHeader } from "../components/MainHeader";
import { Aside } from "../components/Aside";
import Head from "next/head";
import { TabHeader } from "../components/TabHeader";
import { BsGraphUp } from "react-icons/bs";
import { Content } from "../components/Content";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <MainHeader>
        <TabHeader
          value="1"
          active={() => false}
          title="PLAN/MLE"
        />

        <TabHeader
          value="2"
          active={() => false}
          title="LINE/AVANCO"
        />

        <TabHeader
          value="3"
          active={() => false}
          title="ENSIO"
        />

        <TabHeader
          value={<BsGraphUp />}
          active={() => true}
          title="ENSIO"
        />
      </MainHeader>

      <div className='flex flex-row'>
        <Aside />
        <Content>
          <h1>Opa</h1>
        </Content>
      </div>
    </>
  );
}
