import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
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
import { functionsUtils } from "src/shared/utils/functionsUtils";

export interface IData {
  profiles: IProfile[];
  departments: IDepartment[];
  userEdit: IUsers | any;
  Cultures: object | any;
  userCulture: object | any;
}

export default function AtualizarUsuario({ departments, profiles, userEdit, Cultures, userCulture }: IData) {
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
  const userCultures = new Array();

  if (userCulture) {
    Object.keys(userCulture).forEach((_, item) => {
      userCultures.push(userCulture[item].cultureId);
    });
  } 

  const formik = useFormik<IUsers>({
    initialValues: {
      id: userEdit[0].id,
      name: userEdit[0].name,
      email: userEdit[0].email,
      cpf: userEdit[0].cpf,
      tel: userEdit[0].tel,
      password: functionsUtils.Crypto(userEdit[0].password, 'decipher'),
      confirmPassword: functionsUtils.Crypto(userEdit[0].password, 'decipher'),
      registration: userEdit[0].registration,
      departmentId: userEdit[0].departmentId,
      jivochat: userEdit[0].jivochat,
      status: userEdit[0].status,
      app_login: userEdit[0].app_login,
      created_by: userLogado.id,
      cultures:[]
    },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        Swal.fire("erro de credenciais")     
        return
      }
      // validateInputs(values);
  
      if (!values.name || !values.email || !values.cpf || !values.registration || !values.departmentId || !values.password || !values.confirmPassword) { return; }
      
      let ObjProfiles;
      let input: any; 
      const auxObject: any = [];
      let auxObject2: any = [];

      Object.keys(values.cultures).forEach((item) => {
        input =  document.querySelector('select[name="profiles_'+values.cultures[item]+'"]');
        auxObject2 = [];
        for (let i = 0; i < input.options.length; i++) {
          if (input.options[i].selected) {
            auxObject2.push(input.options[i].value);
          }
        }
        ObjProfiles = {
          cultureId: values.cultures[item], 
          profiles: auxObject2
        }
        auxObject.push(ObjProfiles);
      });
      await userService.update({
        id: values.id,
        name: values.name,
        email: values.email,
        cpf: values.cpf,
        tel: values.tel,
        password: values.password,
        registration: values.registration,
        departmentId: values.departmentId,
        jivochat: values.jivochat,
        status: values.status,
        app_login: values.app_login,
        created_by: values.created_by,
        cultures: auxObject,
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
                mask=""
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
                mask=""
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
              <Select
                id="department.id"
                required
                name="departmentId"
                onChange={formik.handleChange}
                values={departments}
                selected={userEdit[0].departmentId}
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

          <div className="w-full mt-6">
              <h2 className="text-gray-900 text-2xl mb-4">
                Permissões de Culturas
              </h2>
              <div className="w-full grid grid-cols-3 gap-6">
                {
                  Cultures.map((culture: any, index: any) => (
                    <>
                    <div key={index} className="flex items-center p-4 border border-solid border-gray-200 rounded shadow">
                      <div className="w-full text-xl">
                        <CheckBox
                          key={culture.id}
                          title={culture.name}
                          id={`culture_${culture.id}`}
                          name="cultures"
                          onChange={formik.handleChange}
                          value={culture.id}
                        />
                      </div>

                      <div className="w-full">
                        <h4 className='block text-gray-900 text-sm font-bold mb-2'>
                          Permissões
                        </h4>
                        <div>
                          <MultiSelectComponent
                            id={`profiles_${culture.id}`}
                            name={`profiles_${culture.id}`}
                            onChange={formik.handleChange}
                            dataSource={profiles as any}
                            mode="Box"
                            fields={{
                              text: "name",
                              value: "id"
                            }}
                            placeholder={`Permissões de culturas para ${!formik.values.name ? 'Usuário': formik.values.name}`}
                          />
                        </div>
                      </div>
                    </div>
                    </>
                  ))
                }
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
  const users = await resU.json();
  const userEdit = users.response;
  const Cultures = (await apiCulture.json()).response;
  const userCulture = users.culture;
  return { props: { departments, profiles, userEdit, Cultures, userCulture } }
}
