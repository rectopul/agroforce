import { BsGraphUp } from "react-icons/bs";
import { Aside } from "../components/Aside";
import Head from "next/head";

import { MainHeader } from "../components/MainHeader";
import { TabHeader } from "../components/MainHeader/TabHeader";
import { Content } from "../components/Content";

export default function Dashboard() {
  function handleTabsHeader() {
    const tabs = [
      { title: 'Teste', value: '1', active: (() => false)  },
      { title: 'Teste1', value: '2', active: (() => false)  },
      { title: 'Teste2', value: '3', active: (() => false)  },
      { title: 'Teste3', value: <BsGraphUp />, active: (() => true)  },
    ];

    return tabs;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <MainHeader
        name="Juliana Aparecia da Silva"
        avatar="/images/person.jpg"
      >
        {
          handleTabsHeader().map((tab) => {
            return (
              <TabHeader
                key={tab.title}
                title={tab.title}
                value={tab.value}
                active={tab.active}
              />
            )
          })
        }

      </MainHeader>

      <div className='flex flex-row'>
        <Aside />
        <Content>
          <h1>Conteudo</h1>
        </Content>
      </div>
    </>
  );
}
