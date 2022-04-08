import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button, Select } from "src/components";

interface ISelectData {
  id: number;
  name: string;
}

interface IImportPlanilhaProps {
  title: string;
  dataTable: ISelectData[];
}

interface ImportsProps {
  data: IImportPlanilhaProps[];
}

export function ImportPlanilha({ data }: ImportsProps) {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [allData, setAllData] = useState<IImportPlanilhaProps[]>(
    () => data
  );

  // const HandleGenerateSelectColumns = (title: string, newData: IImportPlanilhaProps) => {
  //   const index = allData.findIndex(item => item.title = title);

  //   if (index === -1) {
  //     alert('erro')
  //     return;
  //   }

  //   // if (totalSelect > allData.length) {
  //   //   data.push(newData);
  //   // }

  //   setAllData([newData]);

  //   return allData[index].dataTable;
  // }

  return (
    <>
      <Head><title>Importação de planilha</title></Head>

      <div className="w-full h-screen bg-gray-200">
        <header className="h-importation-input-header flex items-center justify-between px-10">
          <div className="w-30 h-9">
            <Button 
              type="button"
              value="Voltar"
              bgColor="bg-red-600"
              textColor="white"
              icon={<IoMdArrowBack size={18} />}
              onClick={() => router.back()}
            />
          </div>
          <div className="flex items-center gap-2 px-2">
            <strong>
              Adicionar colunas:
            </strong>
            <input
              type="number" 
              name="quantity-columns" 
              id="columns" 
              placeholder="Adicionar colunas"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="
                h-9
                border-2
                rounded-lg
                px-2
                border-blue-900
              "
            />
          </div>

          <div className="w-40 h-9">
            <Button
              type="submit"
              value="Cadastrar"
              bgColor="bg-blue-600"
              textColor="white"
              icon={<RiFileExcel2Line size={20} />}
              onClick={() => {}}
            />
          </div>
        </header>

        <main className="	
          w-full
          h-importation-header
          flex
          justify-start
          items-center
          px-2
          bg-blue-900
          text-white
        ">
          <span className="w-32">Coluna do Excel</span>
          <div className="w-full h-full ml-20 flex justify-start items-center gap-3">
            {allData.map(item => (
              <div
                key={item.title}
                className="
                  w-32
                  h-14   
                  flex items-center
                  justify-center
                ">
                <strong 
                  className="
                  flex
                  items-center
                  justify-center
                  h-full w-14
                  border-2
                  rounded-full
                  text-2xl
                ">
                  { item.title }
                </strong>
              </div>
            ))}
          </div>
        </main>



       <div className="flex">
          <aside className="flex flex-row w-aside-content-importation">
            <div className="
              w-full
              h-importation-aside
              flex
              flex-col
              gap-14
              py-4
              px-2
              bg-blue-900
              text-white
            ">
              <span className="w-44">Campo(s) Obrigatório(s)</span>
              <span>Campo(s) Opcional(is)</span>
            </div>
          </aside>


          <div className="
            h-importation-content
            w-importation-content
            flex
            flex-col
            items-start
            gap-9
            px-auto
            py-2
            bg-gray-200

            overflow-y-scroll
            border-2 
            border-red-600
          ">
            <div className="flex mx-1 pl-2 justify-start items-center gap-3">
              {allData.map(item => (
                <div key={item.title} className="h-11 w-32">
                  <Select selected={false} values={item.dataTable} />
                </div>
              ))}
            </div>

            <div className="flex mx-1 pl-2 justify-start items-center gap-3">
              {Array(amount).fill('').map((_, index) => {
                return (
                  <div key={index} className="h-11 w-32">
                    <Select selected={false} values={allData[amount].dataTable}/>
                  </div>
                )
              })}
            </div>

            {/* {rows.map((newItem, index) => (
              <div key={index} className="w-full flex mx-1 pl-2 justify-start items-center gap-3">
                {allData.map((item, index) => (
                  <div key={index} className="h-11 w-32">
                    <Select selected={false} values={item.dataTable} />
                  </div>
                ))}
              </div>
            ))} */}
          </div>
       </div>
      </div>
    </>
  );
}
