import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router'
import getConfig from 'next/config';
import { useFormik } from "formik";
import Swal from 'sweetalert2'
import InputMask from 'react-input-mask';

import { userService } from "src/services";

import  IProfile  from "../../../../components/props/profileDTO";
import  IUsers  from "../../../../components/props/userDTO";
import  IDepartment  from "../../../../components/props/departmentDTO";

import { 
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  Select2,
  TabHeader
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';
import { IoMdArrowBack } from "react-icons/io";
import { RiUserSettingsLine } from "react-icons/ri";
export interface IData {
  profiles: IProfile[];
  departments: IDepartment[];
  userEdit: IUsers | any;
  Cultures: object | any;
}

export default function AtualizarUsuario({ departments, profiles, userEdit, Cultures }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG' && tab.data.map(i => i.labelDropDown === 'Usuários')
    ? tab.statusTab = true
    : tab.statusTab = false
  ));

  const router = useRouter();
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const optionSorN =  [{id: 1, name: "Sim"}, {id: 0, name: "Não"}];

  const maskTel = '(99)99999-9999' || '(99)9999-9999';

  const formik = useFormik<IUsers>({
    initialValues: {
      id: userEdit[0].id,
      name: userEdit[0].name,
      email: userEdit[0].email,
      cpf: userEdit[0].cpf,
      tel: userEdit[0].tel,
      password: userEdit[0].password,
      confirmPassword: userEdit[0].password,
      profiles: [],
      registration: userEdit[0].registration,
      departmentId: userEdit[0].departmentId,
      jivochat: userEdit[0].jivochat,
      status: userEdit[0].status,
      app_login: userEdit[0].app_login,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        Swal.fire("erro de credenciais")     
        return
      }

      let ObjProfiles;
      const auxObject = new Array();

      Object.keys(values.profiles).forEach((_, item) => {
        ObjProfiles = {profileId: values.profiles[item]}
        auxObject.push(ObjProfiles);
      });

      await userService.update({
        id: values.id,
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
          Swal.fire('Usuário atualizado com sucesso!')
          router.back();

        } else {
          Swal.fire(response.message);
        }
      })
    },
  });
  
  return (
    <>
      <Head>
        <title>Atualizar Usuário</title>
      </Head>
      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar usuário</h1>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código
              </label>
              <Input 
                disabled
                type="text"
                value={userEdit[0].id}
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input 
                id="name"
                name="name"
                type="text" 
                placeholder="José Oliveira"
                required
                max="40"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Login
              </label>
              <Input 
                type="email"
                required 
                placeholder="usuario@tmg.agr.br" 
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
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
                *CPF
              </label>
              <InputMask
                mask="999.999.999-99"
                required
                disabled
                style={{ background: '#e5e7eb' }}
                placeholder="111.111.111-11"
                maxLength={11}
                minLength={11}
                id="cpf"
                name="cpf"
                onChange={formik.handleChange}
                value={formik.values.cpf}
                className="shadow
                  appearance-none
                  bg-white bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  w-full
                  py-2 px-3
                  text-gray-900
                  leading-tight
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Telefone
              </label>
              <InputMask
                mask={maskTel}
                required
                placeholder="(11) 99999-9999"
                id="tel"
                name="tel"
                onChange={formik.handleChange}
                value={formik.values.tel}
                className="shadow
                  appearance-none
                  bg-white bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  w-full
                  py-2 px-3
                  text-gray-900
                  leading-tight
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Setor
              </label>
              <Select2
                id="department.id"
                required
                name="departmentId"
                onChange={formik.handleChange}
                data={departments}
                selected={formik.values.departmentId}
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
                *Matricula
              </label>
              <Input 
                type="number" 
                required
                placeholder="Campo númerico"
                id="registration"
                name="registration"
                onChange={formik.handleChange}
                value={formik.values.registration}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Senha
              </label>
              <Input 
                type="password" 
                required
                placeholder="*************"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Confirmar senha
              </label>
              <Input 
                type="password"
                required
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
                *Libera jivochat
              </label>
              <Select
                values={optionSorN}
                required
                id="jivochat"
                name="jivochat"
                onChange={formik.handleChange}
                value={formik.values.jivochat}
                selected={userEdit[0].jivochat}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Login do App
              </label>
              <div className="h-10">
                <Select
                  values={optionSorN} 
                  required
                  id="app_login"
                  name="app_login"
                  onChange={formik.handleChange}
                  value={formik.values.app_login}
                  selected={userEdit[0].app_login}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Tipo de perfil
              </label>
              <div className="flex gap-6 border-b border-gray-300">
                {
                  profiles.map((profile) => (
                    <>
                      <CheckBox
                        key={profile.id}
                        title={profile.name}
                        id={`profiles.${profile.id}`}
                        name="profiles"
                        onChange={formik.handleChange}
                        value={formik.values.id}
                        defaultChecked={profiles.includes(profile)}
                      />
                    </>
                  ))
                }
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Culturas
              </label>
              <div className="flex gap-6 border-b border-gray-300">
                {
                  Cultures.map((culture) => (
                    <>
                      <CheckBox
                        key={culture.id}
                        title={culture.name}
                        id={`cultures.${culture.id}`}
                        name="cultures"
                        onChange={formik.handleChange}
                        value={formik.values.id}
                        defaultChecked={culture.includes(culture)}
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
                value="Atualizar"
                bgColor="bg-blue-600"
                icon={<RiUserSettingsLine size={18} />}
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

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const  token  =  context.req.cookies.token;
  // Fetch data from external API
  const requestOptions: object | any = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };
  const resD = await fetch(`${baseUrl}/departament`, requestOptions)
  const resP = await fetch(`${baseUrl}/profile`, requestOptions)
  const resU = await fetch(`${baseUrl}/` + context.query.id, requestOptions)
  const apiCulture = await fetch(`${publicRuntimeConfig.apiUrl}/culture`, requestOptions);

  const departments = await resD.json();
  const profiles = await resP.json();
  const userEdit = (await resU.json());
  const Cultures = (await apiCulture.json()).response;

  return { props: { departments, profiles, userEdit, Cultures } }
}
