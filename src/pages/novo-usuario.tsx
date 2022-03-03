import { useFormik } from "formik";
import Head from "next/head";
import { BsCheckLg } from 'react-icons/bs';

import { userService } from "src/services";

import { TabHeader } from "../components";
import { Content } from "../components";
import { Input } from "../components"; 
import { Select } from "../components";
import { Button } from "../components";


interface IUsers {
  name: string;
  login?: string;
  email: string;
  cpf: string;
  tel: string;
  registration?: string;
  department: string;
  password: string;
  confirmPassword: string;
  profile?: string;
  jivochat?: number;
  status?: number;
  appLogin?: string;
  created_by: any;
}

export default function NovoUsuario() {
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
      login: '',
      email: '',
      cpf: '',
      tel: '',
      password: '',
      confirmPassword: '',
      profile: '',
      registration: '',
      department: '',
      jivochat: 0,
      status: 1,
      appLogin: '',
      created_by: userLogado.id,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      
      if (values.password !== values.confirmPassword) {
        alert("Erro de credenciais");
        return
      }

      userService.createUsers({
        name: values.name,
        // login: values.login,
        email: values.email,
        cpf: values.cpf,
        tel: values.tel,
        password: values.password,
        // profile: values.profile,
        registration: values.registration,
        department: values.department,
        jivochat: values.jivochat,
        status: values.status,
        // appLogin: values.appLogin,
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
          <h1 className="text-2xl">Novo usuário</h1>

          <div className="w-full
            flex 
            justify-around
            gap-2
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código usuário
              </label>
              <Input value={123456} disabled style={{ background: '#e5e7eb' }} />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Nome usuário
              </label>
              <Input 
                type="text" 
                placeholder="Nome"
                id="name"
                name="name"
                required
                max="40"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login único
              </label>
              <Input 
                type="text" 
                placeholder="Login de usuário" 
                id="login"
                name="login"
                max="40"
                onChange={formik.handleChange}
                value={formik.values.login}
              />
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-2
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                CPF
              </label>
              <Input
                type="text"
                placeholder="ex: 111.111.111-11"
                maxLength={11}
                minLength={11}
                id="cpf"
                name="cpf"
                onChange={formik.handleChange}
                value={formik.values.cpf}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Matricula
              </label>
              <Input 
                type="text" 
                placeholder="Matricula do usuário"
                max="50"
                id="registration"
                name="registration"
                onChange={formik.handleChange}
                value={formik.values.registration}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Selecione o Setor
              </label>
              <Select
                values={["Administração", "Gestão", "RH", "TI"]}
                id="department"
                name="department"
                onChange={formik.handleChange}
                value={formik.values.department}
              />
            </div>
          </div>

          <div className="w-8/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                E-mail
              </label>
              <Input 
                type="email" 
                placeholder="usuario@tmg.com.br"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
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
          <div className="w-8/12
            flex
            justify-between
            gap-2
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
          <div className="w-8/12
            flex
            justify-between
            gap-2
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
              <Input 
                type="text" 
                placeholder="Login APP usuário" 
                id="appLogin"
                name="appLogin"
                onChange={formik.handleChange}
                value={formik.values.appLogin}
              />
            </div>
          </div>

          <div className="w-4/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Selecione um ou mais perfis
              </label>
              <Select
                values={["Administrator", "Funcionário", "Usuário comum"]}
                id="profile"
                name="profile"
                onChange={formik.handleChange}
                value={formik.values.profile}
              /> 
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
