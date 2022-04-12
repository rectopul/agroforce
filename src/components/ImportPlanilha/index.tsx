import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button, Select } from "src/components";
import { AZ } from "src/shared/utils/a-z";

interface IImportPlanilhaProps {
  data: string[];
  moduleId: number;
}


export function ImportPlanilha({ data, moduleId }: IImportPlanilhaProps) {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [startAZ, setStartAZ] = useState<number>(
    data.length
  );

  function handleSetDataSelect(value: string) {
    const index = data.findIndex(item => item === value);

    if (index === -1) {
      alert('Erro na função -> handleSetDataSelect')
      return;
    }

    
  };

  return (
    <>
      <Head><title>Importação de planilha</title></Head>

      <div className="w-screen h-screen bg-gray-200">
        <header className="h-importation-header bg-blue-900">
          <div className="h-14 flex items-center justify-between bg-gray-200">
            <div className="w-30 h-9 pl-2">
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

            <div className="w-40 h-9 pr-2">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<RiFileExcel2Line size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="
            h-24
            bg-blue-900
            text-white
            px-2
          ">
            <span className="h-full flex items-center">Coluna do Excel</span>
          </div>
        </header>

        <div className="flex z-40">
          <aside className="
            h-importation-aside
            w-aside-content-importation
            flex
            flex-col
            gap-8
            pl-2
            bg-blue-900
            text-white
          ">
            <span className="w-full py-7">Campo(s) Obrigatório(s)</span>
            <span className="w-full pt-4">Campo(s) Opcional(is)</span>
          </aside>

          <main className="relative bottom-32 w-importation-content mt-2.5 -mb-28 flex flex-col overflow-x-scroll">
            <div className="absolute flex pl-2 justify-start items-center py-9 gap-3 text-white">
              {AZ.map((item, index) => {
                {return Array(data.length).fill('').map((_, indexArray) => (   
                  <div key={index} className="h-16 w-32 flex items-center justify-center">
                    {!index
                    ? (
                      <strong className="h-16 w-16 flex justify-center items-center border-2 rounded-full">
                        { AZ[indexArray].slice(index) }
                      </strong>
                    ): (
                      <></>
                    )}
                  </div>
                ))}
              })}
            </div>

            <div className="flex pl-2 justify-start items-center py-7 gap-3 mt-28">
              {Array(data.length).fill('').map((_, index) => (
                <div key={index} className="h-11 w-32">
                  <Select selected={false} values={[{ id: index, name: data[index] }]}/>
                </div>
              ))}
            </div>

            <div className="flex pl-2 pt-6 justify-start items-center gap-3">
              {Array(amount).fill('').map((_, index) => (
                <div key={index} className="h-11 w-32">
                  <Select selected={false} values={[{ id: index, name: data[index] }]}/>
                </div>
              ))}
            </div>
          </main>
       </div>
      </div>
    </>
  );
}
