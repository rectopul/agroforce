import Head from 'next/head';
import { useRouter } from 'next/router';
import { BiImport } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { Button, Select } from 'src/components';

export default function ImportacaoPlanilha() {
  const router = useRouter();

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
          items-center
          px-2
          bg-blue-900
          text-white
        "
        >
          <span>Coluna do Excel</span>

          <div className="h-full ml-24 flex items-center gap-3">
            <div
              className="
                w-32
                h-14
                flex items-center
                justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                A
              </strong>
            </div>

            <div
              className="
                h-14
                w-32
                flex items-center
                justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                B
              </strong>
            </div>
            <div
              className="
              h-14
              w-32
              flex items-center
              justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                C
              </strong>
            </div>

            <div
              className="
              h-14
              w-32
              flex items-center
              justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                D
              </strong>
            </div>
            <div
              className="
              h-14
              w-32
              flex items-center
              justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                E
              </strong>
            </div>
            <div
              className="
              h-14
              w-32
              flex items-center
              justify-center
              "
            >
              <strong className="
                flex
                items-center
                justify-center
                h-full w-14
                border-2
                rounded-full
                text-2xl
              "
              >
                F
              </strong>
            </div>
          </div>
        </main>

        <aside className="flex flex-row">
          <div className="
            h-importation-aside
            w-aside-content-importation
            flex
            flex-col
            gap-14
            py-4
            px-2
            bg-blue-900
            text-white
          "
          >
            <span>Campo(s) Obrigatório(s)</span>
            <span>Campo(s) Opcional(is)</span>
          </div>

          <div className="
            w-full
            flex
            flex-col
            gap-9
            px-6
            py-2
            overflow-y-scroll
            overflow-x-scroll
          "
          >
            <div className="w-full flex gap-3">
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
            </div>

            <div className="w-full flex gap-3">
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
              <div className="h-11 w-32">
                <Select selected={false} values={[]} />
              </div>
            </div>

            <div className="
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
            >
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
                  value="Importar"
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<BiImport size={20} />}
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
