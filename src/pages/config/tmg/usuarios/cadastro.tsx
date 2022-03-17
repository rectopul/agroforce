import { GetServerSideProps } from "next";
import { useFormik } from "formik";
import Head from "next/head";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { IoMdArrowBack } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";

import { userService } from "src/services";

import  IProfile  from "../../../../components/props/profileDTO";
import  IUsers  from "../../../../components/props/userDTO";
import  IDepartment  from "../../../../components/props/departmentDTO";

import {
  TabHeader,
  Content,
  Input,
  Select,
  Button,
  CheckBox
} from "../../../../components";

import * as ITabs from '../../../../shared/utils/dropdown';
export interface IData {
  profiles: IProfile[];
  departments: IDepartment[];
}

export default function NovoUsuario({ departments, profiles }: IData) {
  const { tmgDropDown, tabs } = ITabs.default;
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const optionSorN =  [{id: 1, name: "sim"}, {id: 0, name: "Não"}];
  const router = useRouter();

  const formik = useFormik<IUsers>({
    initialValues: {
      name: '',
      email: '',
      cpf: '',
      tel: '',
      password: '',
      confirmPassword: '',
      profiles: [{ id: 0 }],
      registration: 0,
      departmentId: 0,
      jivochat: 0,
      status: 1,
      app_login: 0,
      created_by: userLogado.id,
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.name || !values.email || !values.cpf || !values.registration || !values.departmentId || !values.password || !values.confirmPassword) { console.log('entrou'); return; }
      let ObjProfiles;
      const auxObject = new Array();

      Object.keys(values.profiles).forEach((_, item) => {
        ObjProfiles = {profileId: values.profiles[item]}
        auxObject.push(ObjProfiles);
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
          Swal.fire('Usuário cadastrado com sucesso!')
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { let inputName: any = document.getElementById("name"); inputName.style.borderColor= 'red'; } else { let inputName: any = document.getElementById("name"); inputName.style.borderColor= ''; }
    if (!values.email) { let inputEmail: any = document.getElementById("email"); inputEmail.style.borderColor= 'red'; } else { let inputEmail: any = document.getElementById("email"); inputEmail.style.borderColor= ''; }
    if (!values.cpf) { let inputCpf: any = document.getElementById("cpf"); inputCpf.style.borderColor= 'red'; } else { let inputCpf: any = document.getElementById("cpf"); inputCpf.style.borderColor= ''; }
    if (!values.registration) { let inpuRegistration: any = document.getElementById("registration"); inpuRegistration.style.borderColor= 'red'; } else { let inpuRegistration: any = document.getElementById("registration"); inpuRegistration.style.borderColor= ''; }
    if (!values.departmentId) { let inputDepartmentId: any = document.getElementById("departmentId"); inputDepartmentId.style.borderColor= 'red'; } else { let inputDepartmentId: any = document.getElementById("departmentId"); inputDepartmentId.style.borderColor= ''; }
    if (!values.password) { let inputPassword: any = document.getElementById("password"); inputPassword.style.borderColor= 'red'; } else { let inputPassword: any = document.getElementById("password"); inputPassword.style.borderColor= ''; }
    if (!values.confirmPassword) { let inputconfirmPassword: any = document.getElementById("confirmPassword"); inputconfirmPassword.style.borderColor= 'red'; } else { let inputconfirmPassword: any = document.getElementById("confirmPassword"); inputconfirmPassword.style.borderColor= ''; }

    if (values.password !== values.confirmPassword) {
        Swal.fire("erro de credenciais")         
    }
  }
  return (
    <>
      <Head>
        <title>Novo usuário</title>
      </Head>


      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo usuário</h1>
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
                values={departments}
                id="departmentId"
                name="departmentId"
                onChange={formik.handleChange}
                value={formik.values.departmentId}
                selected={false}
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
                values={optionSorN}
                id="jivochat"
                name="jivochat"
                onChange={formik.handleChange}
                value={formik.values.jivochat}
                selected={false}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login do App
              </label>
              <div className="h-10">
                <Select
                  values={optionSorN} 
                  id="app_login"
                  name="app_login"
                  onChange={formik.handleChange}
                  value={formik.values.app_login}
                  selected={false}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Tipo de perfil
              </label>
              <div className="flex gap-6 border-b border-gray-300">
                {
                  profiles.map((profile) => (
                    <>
                      <CheckBox
                        key={profile.id}
                        title={profile.name}
                        name="profiles"
                        onChange={formik.handleChange}
                        value={profile.id}
                      />
                    </>
                  ))
                }
              </div>
            </div>
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => {router.push('/config/tmg/usuarios/')}}
              />
            </div>
            <div className="w-40">
              <Button 
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<FiUserPlus size={18} />}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async ({req}) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const  token  =  req.cookies.token;
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiDepartment = await fetch(`${baseUrl}/departament`, requestOptions);
  const apiProfile = await fetch(`${baseUrl}/profile`, requestOptions);

  const departments = await apiDepartment.json();
  const profiles = await apiProfile.json();

  return { props: { departments, profiles } }
}


