import { useFormik } from "formik";
import Head from "next/head";
import { BsCheckLg } from 'react-icons/bs';
import { CheckBox } from "src/components/CheckBox";

import { userService, departmentService,profileService  } from "src/services";

import { TabHeader } from "../../components";
import { Content } from "../../components";
import { Input } from "../../components"; 
import { Select } from "../../components";
import { Button } from "../../components";

interface IProfile {
  id: number;
  name?: string;
}

interface IUsers {
  name: string;
  email: string;
  cpf: string;
  tel: string;
  password: string;
  registration: number;
  jivochat: number;
  status?: number;
  created_by: any;
  departmentId: number;
  confirmPassword: string;
  app_login: number;
  profiles: IProfile[];
  // profiles: [{ profileId: number, created_by: number }];
}
export default function NovoUsuario() {
//  departmentService.getAll('');
//  profileService.getAll('');

  const profileUser: IProfile[] = [
    { id: 1, name: "Master " },
    { id: 2, name: "Admin" },
    { id: 3, name: "Dados" },
    { id: 4, name: "Coordenador" },
    { id: 5, name: "Pesquisador" },
    { id: 6, name: "Técnico" },
    { id: 7, name: "Visualizador" },
  ];

  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
    { title: 'ENSAIO', value: <BsCheckLg />, status: false  },
    { title: 'LOCAL', value: <BsCheckLg />, status: false  },
    { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false  },
    { title: 'NPE', value: <BsCheckLg />, status: false  },
    { title: 'QUADRAS', value: <BsCheckLg />, status: false  },
    { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false },
  ];

  const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const formik = useFormik<IUsers>({
    initialValues: {
      name: '',
      email: '',
      cpf: '',
      tel: '',
      password: '',
      confirmPassword: '',
      profiles: [],
      registration: 0,
      departmentId: 0,
      jivochat: 0,
      status: 1,
      app_login: 0,
      created_by: userLogado.id,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      
      if (values.password !== values.confirmPassword) {
        alert("Erro de credenciais");
        return
      }

      let ObjProfiles;
      const auxObject = new Array();

      Object.keys(values.profiles).forEach((item) => {
        ObjProfiles = {profileId: values.profiles[item]}
        auxObject.push(ObjProfiles);;
      });

      userService.createUsers({
        name: values.name,
        email: values.email,
        cpf: values.cpf,
        tel: values.tel,
        password: values.password,
        profiles: auxObject,
        registration: values.registration,
        departmentId: values.departmentId,
        jivochat: values.jivochat,
        status: values.status,
        app_login: values.app_login,
        created_by: values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          alert("Usuário criado com sucesso!");
        }
      })
    },
  });

  return (
    <>
      <Head>
        <title>Novo usuário</title>
      </Head>


      <Content headerCotent={
        <TabHeader data={tabs} />
      }>
        
        <div className="w-full
          h-20
          flex
          items-center
          gap-2
          px-5
          rounded-lg
          border-b border-blue-600
          shadow
          bg-white
        ">
          <div className="h-10 w-32">
            <Button 
              value="Usuário"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Safra"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Portfólio"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
        </div>

        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo usuário</h1>
            <div className="flex flex-col">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Tipo de perfil
              </label>
              <div className="flex gap-6 border-b border-gray-300">
                <CheckBox
                  id="profiles"
                  name="profiles"
                  onChange={formik.handleChange}
                  data={profileUser}
                />
              </div>
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Nome usuário
              </label>
              <Input 
                type="text" 
                placeholder="José Oliveira"
                required
                max="40"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login
              </label>
              <Input 
                type="email" 
                placeholder="usuario@tmg.agr.br" 
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                CPF
              </label>
              <Input
                type="text"
                placeholder="111.111.111-11"
                maxLength={11}
                minLength={11}
                id="cpf"
                name="cpf"
                onChange={formik.handleChange}
                value={formik.values.cpf}
              />
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Matricula
              </label>
              <Input 
                type="number" 
                placeholder="Campo númerico"
                id="registration"
                name="registration"
                onChange={formik.handleChange}
                value={formik.values.registration}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Setor
              </label>
              <Select
                values={["Administração", "Gestão", "RH", "TI"]}
                id="departmentId"
                name="departmentId"
                onChange={formik.handleChange}
                value={formik.values.departmentId}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Telefone
              </label>
              <Input 
                type="tel" 
                placeholder="(11) 99999-9999"
                id="tel"
                name="tel"
                onChange={formik.handleChange}
                value={formik.values.tel}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Senha
              </label>
              <Input 
                type="password" 
                placeholder="*************"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Confirmar senha
              </label>
              <Input 
                type="password"
                placeholder="*************"
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Libera jivochat
              </label>
              <Select
                values={["Sim", "Não"]}
                id="jivochat"
                name="jivochat"
                onChange={formik.handleChange}
                value={formik.values.jivochat}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login do App
              </label>
              <div className="h-10">
                <Select
                  values={["Não", "Sim"]} 
                  id="app_login"
                  name="app_login"
                  onChange={formik.handleChange}
                  value={formik.values.app_login}
                />
              </div>
            </div>
          </div>

          <div className="h-10 w-full
            flex
            justify-center
            mt-10
          ">
            <div className="w-40">
              <Button 
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
