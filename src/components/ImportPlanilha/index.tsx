import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button, Select } from "src/components";

interface IImportPlanilhaProps {
  title: string;
  dataTable: any[];
}

interface ImportsProps {
  data: IImportPlanilhaProps[];
}

export function ImportPlanilha({ data }: ImportsProps) {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [items, setItems] = useState<IImportPlanilhaProps[]>(
    !data 
    ? () => [{ title: '?', dataTable: [] }]
    : () => data
  );

  useEffect(() => {
    let arrays = data.length;
    let newObjectData = data[arrays + amount];
    items.push({
      title: '!',
      dataTable:  [{ id: 4, name: '!' }]
    });
  }, [amount]);

  console.log(data);

  return (
    <>
      <Head><title>Importação de planilha</title></Head>

      <div className="w-full h-screen">
        <header className="h-importation-input-header flex items-center gap-2 px-2">
          <label
            htmlFor="columns"
            className="
              p-2
              rounded-lg
              bg-blue-900
              text-white
            "
          >
            Quantidade de colunas
          </label>
          <input
            type="number" 
            name="quantity-columns" 
            id="columns" 
            placeholder="ex: 7"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="
              h-9
              border-2
              rounded-lg
              px-2
              border-blue-900
            "
          />
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
          <div className="w-full h-full ml-24 flex items-center gap-3 overflow-x-scroll">
            {items.map(item => (
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

        <aside className="flex flex-row">
          <div className="
            h-importation-aside
            min-w-aside-content-importation
            max-w-aside-content-importation
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


          <div className="
            w-full
            flex
            flex-col
            gap-9
            mx-6
            py-2
            bg-gray-200
            border-2 border-red-600
            overflow-y-scroll
          ">
              <div className="w-full flex gap-3 overflow-x-scroll">
                {items.map(item => (
                  <div key={item.title} className="min-w-32 h-11 w-32">
                    <Select selected={false} values={item.dataTable} />
                  </div>
                ))}
              </div>

              <div className="w-full flex gap-3 overflow-x-scroll">
                {items.map(item => (
                  <div key={item.title} className="min-w-32 h-11 w-32">
                    <Select selected={false} values={item.dataTable} />
                  </div>
                ))}
              </div>

              <div className="
              h-10 w-full
              flex
              gap-3
              justify-center
              mt-10
            ">
              <div className="w-30">
                <Button 
                  type="button"
                  value="Voltar"
                  bgColor="bg-red-600"
                  textColor="white"
                  icon={<IoMdArrowBack size={18} />}
                  onClick={() => router.back()}
                />
              </div>
              <div className="w-40">
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
          </div>
        </aside>
      </div>
    </>
  );
}
