import { ReactNode, useState } from "react";

type ITabProps = {
  value: ReactNode;
  title: string;
  status: boolean;
}

type IData = {
  data: ITabProps[];
}

export function TabHeader({ data }: IData) {
  const [tabs, setTabs] = useState<ITabProps[]>(() => data);
  
  function handleStatusButton(title: string, status: boolean): void {
    const index = tabs.findIndex((tab) => tab.title === title);

    tabs.filter((btn, indexBtn) => {
      if (indexBtn !== index) {
        btn.status = false;
      } else {
        btn
      }
    });

    setTabs((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;
      return copy;
    });
  }

  return (
    <>
      {
        tabs.map((tab, index) => (
          tab.status ? (
            <button
              key={index}
              onClick={() => handleStatusButton(tab.title, !tab.status)}
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
        
              <span className={`border-white text-sm`}>{tab.title}</span>
            </button>
          ) : (
            <button
              key={index}
              onClick={() => handleStatusButton(tab.title, !tab.status)}
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
