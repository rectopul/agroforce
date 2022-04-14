import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button, Select } from "src/components";
import { AZ } from "src/shared/utils/a-z";
import { Input } from "../../components";
import { useFormik } from "formik";
import { importService } from "src/services";


interface IImportPlanilhaProps {
  data: object | any;
  moduleId: number;
}

interface IImport{
  moduleId: number | any;
  fields: object | any;
}

export function ImportPlanilha({ data, moduleId }: IImportPlanilhaProps) {
  const router = useRouter();

  const [quantityColumns, setQuantityColumns] = useState<number>(data.length);

  const formik = useFormik<IImport>({
    initialValues: {
      moduleId: '',
      fields: ''
    },
    onSubmit: async (values) => {
      let ObjProfiles;
      let input: any; 
      const auxObject: any = [];
      let auxObject2: any = [];

      for (var i = 0; i < quantityColumns; i ++) {
        input =  document.querySelector('select[name="fields_'+i+'"]');
        auxObject2 = [];
        for (let i = 0; i < input.options.length; i++) {
          if (input.options[i].selected) {
            auxObject2.push(input.options[i].value);
          }
        }
        ObjProfiles = {
          profiles: auxObject2
        }
        auxObject.push(ObjProfiles);
      }
    },
  });


  function saveConfig () {
    let Teste;
    let input: any; 
    const auxObject: any = [];
    let auxObject2: any = [];
    for (var i = 0; i < quantityColumns; i ++) {
      input =  document.querySelector('select[name="fields_'+i+'"]');
      auxObject2 = [];
      for (let v = 0; v < input.options.length; v++) {
        if (input.options[v].selected) {
          auxObject.push(input.options[v].value);
        }
      }
    }
    console.log(auxObject);
    // return;

    importService.create({moduleId: moduleId, fields: auxObject}).then((response) => {
      console.log(response);
    });
    console.log(auxObject);
  }

  return (
    <>
      <Head><title>Importação de planilha</title></Head>

      <div className="w-screen h-screen bg-gray-200">
        <div className="h-importation-header bg-blue-900">
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
            
            <div className="flex items-center">
              <strong>
                Adicionar colunas:
              </strong>
               <Input 
                type="number" 
                name="quantity-columns"
                id="quantity-columns"
                min={`${data.length}`}
                value={quantityColumns}
                onChange={(e) => setQuantityColumns(parseInt(e.target.value))}
              />
            </div>

            <div className="w-40 h-9 pr-2">
              <Button
                type="button"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<RiFileExcel2Line size={20} />}
                onClick={() => {saveConfig()}}
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
        </div>

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
            <span className="w-full py-7">Campo(s)</span>
          </aside>
            <form
                className="flex flex-col
                  w-full
                  items-center
                  px-4
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
              <main style={{height: '100%'}}  className="relative bottom-32 w-importation-content mt-2.5 -mb-28 flex flex-col overflow-x-scroll">
                <div className="absolute flex pl-2 justify-start items-center py-9 gap-3 text-white">
                  {AZ.map((item, index) => {
                    if (index < quantityColumns) {
                      {return (
                          <>
                            <div key={index} className="h-16 w-32 flex items-center justify-center">
                              <strong className="h-16 w-16 flex justify-center items-center border-2 rounded-full">
                              {AZ[index]}
                              </strong>
                            </div>
                          </>
                        )                
                      }
                    }
                  })}
                </div>
                <div className="flex pl-2 justify-start items-center py-9 gap-3">
                  <div className="flex pl-2 justify-start items-center py-7 gap-3 mt-28" >
                      {Array(quantityColumns).fill('').map((_, index) => (
                        <div key={index} className="h-11 w-32">
                          <Select name={`fields_${index}`} onChange={formik.handleChange} selected={false} values={data}/>
                        </div>
                      ))}
                  </div>               
                </div>
              </main>
            </form>
       </div>
      </div>
    </>
  );
}
