import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { MdOutlineError } from "react-icons/md";

import { Button } from "../components";

export default function Erro({ msg }: any) {
  const Router = useRouter();
  const router = Router.query;
  //const getUrl = window.location.href?.split("/erro");

  return (
    <>
      <Head>
        <title>Erro</title>
      </Head>

      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src="/images/logo.png" alt="GOM" width={230} height={150} />

        <span className="mt-10 text-2xl">
          {router?.msg
            ? router.msg
            : msg
            ? msg
            : "Ocorreu um erro ao tentar acessar essa página."}
        </span>

        <div className="w-72 h-12 mt-14">
          <Button
            type="button"
            value="Ir para Página Principal"
            bgColor="bg-blue-600"
            textColor="white"
            onClick={() => {
              Router.push("/");
            }}
          />
        </div>
      </div>
    </>
  );
}
