
import { useEffect, ReactNode, useState, ReactChild, ReactFragment, ReactPortal } from "react";

import {
  Aside,
  DropDown,
  MainHeader,
  Select,
  ToolTip,
} from '../../components';
import { TabHeader } from "../MainHeader/TabHeader/index2";

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | ReactNode,
  status: boolean,
};

interface IDropDown {
  labelDropDown: string;
  hrefDropDown: string;
  iconDropDown: ReactNode;
}

interface IContentProps {
  titleTab: string;
  valueTab: string | ReactNode;
  statusTab: boolean;

  data: IDropDown[];
};

interface IContentData {
  contentHeader: IContentProps[];
  children: ReactNode;
};

export function Content2({ contentHeader, children }: IContentData) {
  const userLogado: IUsers | any = JSON.parse(localStorage.getItem('user') as string);
  const cultures: object | any = [];
  const [culturaSelecionada, setCulturaSelecionada] = useState<any>(userLogado.userCulture.cultura_selecionada);
  
  if (userLogado.userCulture.culturas[0]) {
    userLogado.userCulture.culturas.map((value: string | object | any) => {
      cultures.push({id: value.cultureId, name: value.culture.name});
    })
  }

  const [tabs, setTabs] = useState<IContentProps[]>(() => contentHeader);
  
  function handleStatusButton(title: string, status: boolean): void {
    const index = tabs.findIndex((tab) => tab.titleTab === title);

    tabs.filter((btn, indexBtn) => {
      if (indexBtn !== index) {
        btn.statusTab = false;
      } else {
        btn.statusTab = true;
      }
    });

    setTabs((oldUser) => {
      const copy = [...oldUser];

      copy[index].statusTab = status;

      if (!status) copy[index].statusTab = true;

      return copy;
    });
  };

  useEffect(() => {
      userLogado.userCulture.cultura_selecionada =  parseInt(culturaSelecionada);
      localStorage.setItem('user', JSON.stringify(userLogado));
  }, [culturaSelecionada]);

  return (
    <>
      <MainHeader
        name={userLogado.name}
        avatar={ userLogado.avatar }

        headerSelects={
          <div className="h-10 flex gap-2">
            <Select values={cultures}   onChange={e => setCulturaSelecionada(e.target.value)} selected={culturaSelecionada} />
            <Select values={cultures}   onChange={e => setCulturaSelecionada(e.target.value)} selected={culturaSelecionada} />
          </div>
        }
      >
        {contentHeader.map((item, index) => (
          <>
            <ToolTip
              key={index} 
              contentMenu={
                item.data.map((dropdown, index) => (
                 <>
                   <DropDown
                      key={index}
                      label={dropdown.labelDropDown}
                      href={dropdown.hrefDropDown}
                      icon={dropdown.iconDropDown}
                    />
                 </>
                ))
            }>
              {item.statusTab ? (
                <TabHeader 
                  titleTab={item.titleTab} 
                  valueTab={item.valueTab} 
                  statusTab={item.statusTab}
                  handleStatusTabs={handleStatusButton}

                />
              ) : (
                <TabHeader 
                  titleTab={item.titleTab} 
                  valueTab={item.valueTab} 
                  statusTab={item.statusTab} 
                  handleStatusTabs={handleStatusButton}
                />
              )}
            </ToolTip>
          </>
        ))
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