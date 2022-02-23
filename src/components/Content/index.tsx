import { ReactNode } from "react";
import { Aside } from "../Aside";
import { MainHeader } from "../MainHeader";
import { TabHeader } from "../MainHeader/TabHeader";

interface IContentProps {
  children: never[] | ReactNode;
}

export function Content({ children }: IContentProps) {

  const tabs = [
    { title: 'NPE', value: '1', active: (() => true)  },
    // { title: 'Teste1', value: '2', active: (() => false)  },
    // { title: 'Teste2', value: '3', active: (() => false)  },
    // { title: 'Teste3', value: <BsGraphUp />, active: (() => true)  },
  ];

  return (
    <>
      <MainHeader
          name="Juliana Aparecia da Silva"
          avatar="/images/person.jpg"
        >
          {
            tabs.map((tab) => {
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
        <div className="flex flex-col
            w-container-all-main-contents
            h-content
            p-8

            border border-gray-700
            bg-gray-300
          ">
          { children }
        </div>
      </div>

    </>
  );
}
