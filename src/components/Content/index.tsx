
import { ReactNode, useState } from "react";
import { BiUser } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { RiPlantLine, RiSeedlingLine } from "react-icons/ri";
import { userService } from 'src/services';
import {
  Aside,
  DropDown,
  MainHeader,
  Select,
  ToolTip
} from '../../components';
import { TabHeader } from "../MainHeader/TabHeader/index2";


interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string,
  status: boolean,
};

interface IDropDown {
  labelDropDown: string;
  hrefDropDown: string;
  iconDropDown: ReactNode;
}

interface IContentProps {
  titleTab: string;
  valueTab: ReactNode;
  statusTab: boolean;
  hrefTab: string;
  data: IDropDown[];
};

interface IContentData {
  contentHeader: IContentProps[];
  children: ReactNode;
};

export function Content({ contentHeader, children }: IContentData) {
  const userLogado: IUsers | any = JSON.parse(localStorage.getItem('user') as string);
  const cultures: object | any = [];
  const safras: object | any = [];
  const [culturaSelecionada, setCulturaSelecionada] = useState<any>(userLogado.userCulture.cultura_selecionada);
  const [safraSelecionada, setSafraSelecionada] = useState<any>(userLogado.safras.safra_selecionada);

  const avatarDefault = "https://media-exp1.licdn.com/dms/image/C4E0BAQGtzqdAyfyQxw/company-logo_200_200/0/1609955662718?e=2147483647&v=beta&t=sfA6x4MWOhWda5si7bHHFbOuhpz4ZCTdeCPtgyWlAag";

  const [tabsHeader, setTabsHeader] = useState<IContentProps[]>(
    !contentHeader ? [
    {
      titleTab: 'TMG', valueTab: <BsCheckLg />, statusTab: true,  hrefTab: '/config/tmg/usuarios',
      data: [
        {labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine/>},
        {labelDropDown: 'Usuários', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser/> },
        {labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding/> },
        {labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange/> },
        {labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio', iconDropDown: <RiPlantLine/> },
      ],
    },
  ] : () => contentHeader);
  
  if (userLogado.userCulture.culturas[0]) {
    userLogado.userCulture.culturas.map((value: string | object | any) => {
      cultures.push({id: value.cultureId, name: value.culture.name});
    })
  }

  if (userLogado.safras.safras[0]) {
    userLogado.safras.safras.map((value: string | object | any) => {
      safras.push({id: value.id, name: value.year});
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

  function validationCulture (value: any) {
    if (value != culturaSelecionada) {
      setCulturaSelecionada(value);
      userService.logoutSign(userLogado.email, {anterior: culturaSelecionada, selecionada: value});
    } 
  }

  function validationSafras (value: any) {
    if (value != safraSelecionada) {
      setSafraSelecionada(value);
      userLogado.safras.safra_selecionada = parseInt(value);
      localStorage.setItem('user', JSON.stringify(userLogado));
    } 
  }

  return (
    <>
      <MainHeader
        name={userLogado.name}
        avatar={ !userLogado.avatar ? avatarDefault : userLogado.avatar }

        headerSelects={
          <div className="h-10 flex gap-2">
            <Select values={cultures}   onChange={e => validationCulture(e.target.value)} selected={culturaSelecionada} />
            {/* <Select values={safr  as}   onChange={e => validationSafras(e.target.value)} selected={parseInt(safraSelecionada)} /> */}
          </div>
        }
      >
        {tabsHeader.map((item, index) => (
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
                  hrefTab={item.hrefTab} 
                  titleTab={item.titleTab} 
                  valueTab={item.valueTab} 
                  statusTab={item.statusTab}
                  handleStatusTabs={handleStatusButton}
                />
              ) : (
                <TabHeader
                  hrefTab={item.hrefTab} 
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
