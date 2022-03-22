import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { DropDown, ToolTip } from "src/components";

type ITabProps = {
  value: ReactNode;
  title: string;
  href: string;
  status?: boolean;
}

type IDropDownProps = {
  labelDropDown: string;
  hrefDropDown: string;
  iconDropDown: string | ReactNode;
}

type IData = {
  data: ITabProps[];
  dataDropDowns: IDropDownProps[];
}

export function TabHeader({ data, dataDropDowns }: IData) {
  const [tabs, setTabs] = useState<ITabProps[]>(() => data);

  const router = useRouter();
  
  function handleStatusButton(title: string, status: boolean, href: string): void {
    const index = tabs.findIndex((tab) => tab.title === title);

    tabs.filter((btn, indexBtn) => {
      if (indexBtn !== index) {
        btn.status = false;
      } else {
        btn.status = true;
      }
    });

    const handleClickTabHeader = () => {
      router.push(href);
    }

    setTabs((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;

      if (!status) copy[index].status = true;

      return copy;
    });

    handleClickTabHeader();
  };

  return (
    <>
      {
        tabs.map((tab, index) => (
          tab.status ? (
            <ToolTip key={index} contentMenu={
              dataDropDowns.map((dropDown, index) => (
                <DropDown key={index}
                 label={dropDown.labelDropDown} 
                 href={dropDown.hrefDropDown}
                 icon={dropDown.iconDropDown} 
                />
              ))
            }>
              <button
                key={index}
                onClick={() => handleStatusButton(tab.title, !tab.status, tab.href)}
                className="h-full
                flex items-center gap-1
              ">
                <div className={`h-3/5 w-12
                  flex justify-center items-center
                  border border-white rounded-md bg-blue-600
                  rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full
                `}>
                  <span className={`text-white text-2xl`}>{tab.value}</span>
                </div>
          
                <span style={{ color: '#fff' }} className={`border-white text-sm`}>{tab.title}</span>
              </button>
            </ToolTip>
          ) : (
            <button
              key={index}
              onClick={() => handleStatusButton(tab.title, !tab.status, tab.href)}
              className="h-full
              flex items-center gap-1
            ">
              <div className={`h-3/5 w-12
                flex justify-center items-center
                border border-gray-300 rounded-md bg-gray-300
                rounded-bl-full	rounded-br-full	rounded-tr-full	rounded-tl-full
              `}>
                <span className={`text-gray-700 text-2xl`}>{tab.value}</span>
              </div>
        
              <span className={`border-gray-300 text-sm`}>{tab.title}</span>
            </button>
          )
        ))
      }
    </>
  );
}
