import Head from "next/head";
import { FiUserPlus } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";

import { MainHeader } from "../components/MainHeader";
import { Aside } from "../components/Aside";
import { TabHeader } from "../components/MainHeader/TabHeader";
import { Content } from "../components/Content";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Input } from "../components/Input";

export default function Listagem() {
  function handleTabsHeader() {
    const tabs = [
      { title: 'NPE', value: '1', active: (() => true)  },
      // { title: 'Teste1', value: '2', active: (() => false)  },
      // { title: 'Teste2', value: '3', active: (() => false)  },
      // { title: 'Teste3', value: <BsGraphUp />, active: (() => true)  },
    ];

    return tabs;
  }

  const users = [ "Jonatas", "Paulo", "Gabriel", "Isabelle" ];

  let people = [
    {
      id: 1,
      name: 'Paulo Cesar',
      nickname: 'PAULO CESAR',
      telefone: '(11) 1234-123',
      email: 'paulo.jomo@agroforce.com.br',
      image: 'https://avatars.githubusercontent.com/u/55369778?v=4',
      status: true,
    },
    {
      id: 2,
      name: 'Jonatas Rosa Moura',
      nickname: 'JONATAS R MOURA',
      telefone: '(11) 1234-123',
      email: 'jonatas.moura@agroforce.com.br',
      image: 'https://avatars.githubusercontent.com/u/66448546?s=400&u=f9dba4fdf4ff112c31e59860f23578a994deb838&v=4',
      status: true,
    },
    {
      id: 3,
      name: 'Fulano da Silva Sauro',
      nickname: 'FULANO SILVA',
      telefone: '(11) 1234-123',
      email: 'fulano.silva@agroforce.com.br',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_eKClhijhzBYGKsSP-kDvZsXFhu8cdiJXzA&usqp=CAU',
      status: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Listagem</title>
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
                onClick={() => {}}
              />
            )
          })
        }
      </MainHeader>

      <div className='flex flex-row'>
        <Aside />
        <Content>
          <main className="h-full
            flex flex-col
            items-start
            gap-8
            p-8
          ">
            <div className="w-3/12 h-12">
              <Select
                items={users}
              />
            </div>
            <div className="w-full
              flex
              justify-between
              p-4
              rounded-lg
              bg-gray-50
            ">

              <div className="
                w-full
                flex
                gap-4
              ">
                <div>
                  <Button 
                    title="Cadastrar um usuário"
                    bgColor="bg-blue-600"
                    textColor="white"
                    onClick={() => {}}
                    icon={<FiUserPlus />}
                  />
                </div>

                <div className="flex 
                  items-center 
                  p-2
                  px-4
                  rounded-lg
                  bg-blue-600
                ">
                  <span className="text-white" >1</span>
                </div>

                <div className="w-2/4">
                  <Input
                    type="search"
                    placeholder="Pesquisar..."
                    icon={<BiSearchAlt size={18} />}
                  />
                </div>
              </div>

              <div className="
                w-full
                flex
                justify-between
                items-center
                gb-gray-50
              ">
                
                <span className="flex items-center gap-1">
                  Total:
                  <strong className="text-blue-600">
                    6 registro(s)
                    </strong>
                </span>

                <div className="h-full flex gap-2">
                  <Button
                    icon={<FaRegEye size={20} />}
                    onClick={() => {}}
                    bgColor="bg-blue-600"
                    textColor="white"
                  />

                  <Button
                    icon={<HiOutlineClipboardList size={20} />}
                    onClick={() => {}}
                    textColor="white"
                    bgColor="bg-blue-600"
                  />
                </div>
              </div>
            </div>


            <div className="w-full">
              <Table
                data={people}
              />
            </div>
          </main>
        </Content>
      </div>
    </>
  );
}
