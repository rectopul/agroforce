import Head from "next/head";
import { BsCheckLg } from "react-icons/bs";
import { 
  Content,
  TabHeader
} from "../../components";

export default function AtualizarUsuario() {
  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
  ]
  
  return (
    <>
      <Head>
        <title>Atualizar usuário</title>
      </Head>
      <Content
        headerCotent={
          <TabHeader data={tabs} />
        }
      >
        
      </Content>
    </>
  );
}
