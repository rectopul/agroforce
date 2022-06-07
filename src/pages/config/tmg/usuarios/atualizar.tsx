import React, { useState } from "react";
import { capitalize } from '@mui/material';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import { useRouter } from 'next/router';
import { IoMdArrowBack } from "react-icons/io";
import { RiUserSettingsLine } from "react-icons/ri";
import InputMask from 'react-input-mask';
import { prisma } from 'src/pages/api/db/db';
import { userService } from "src/services";
import { functionsUtils } from "src/shared/utils/functionsUtils";
import Swal from 'sweetalert2';
import { Button, CheckBox, Content, Input, Select } from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface IDepartment {
  id: number;
  name: string;
}

interface IProfileUser {
  id: number;
  name: string;
}

interface ICultureUser {
  id: number;
  name: string;
}

interface IUserPermissions {
  id: number;
  id_profiles: number;
  name_profiles: string;
  id_cultures: number;
  name_cultures: string;
}
interface IUserProps {
  id: number;
  name: string;
  email: string;
  cpf: string;
  tel: string;
  password: string;
  registration: number;
  departmentId: number;
  jivochat: number;
  app_login: number;
  status: number;
  cultures: object | any;
  created_by: number | any;
  avatar?: string;
  confirmPassword?: string;
}
export interface IData {
  data: IUserProps | any;
  profilesData: IProfileUser[];
  culturesData: ICultureUser[];
  departmentsData: IDepartment[];
}

export default function AtualizarUsuario({ departmentsData, data, profilesData, culturesData }: IData) {
  const { TabsDropDowns } = ITabs.default;
  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG' && tab.data.map(i => i.labelDropDown === 'Usuários')
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();

  const optionSorN = [{ id: 1, name: "Sim" }, { id: 0, name: "Não" }];
  const userCultures = new Array();
  const userPermissions: any = new Array();

  if (data.users_permissions) {
    Object.keys(data.users_permissions).forEach((_, item) => {
      userCultures.push(data.users_permissions[item].id_cultures);
      if (userPermissions[data.users_permissions[item].id_cultures]) {
        userPermissions[data.users_permissions[item].id_cultures] = [data.users_permissions[item].id_profiles, Number(userPermissions[data.users_permissions[item].id_cultures].join())]
      } else {
        userPermissions[data.users_permissions[item].id_cultures] = [data.users_permissions[item].id_profiles];
      }
    });
  }
  const [Permissions, setPermissions] = useState<any>(userPermissions);

  const formik = useFormik<IUserProps>({
    initialValues: {
      id: data.id,
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      tel: data.tel,
      password: functionsUtils.Crypto(data.password, 'decipher'),
      confirmPassword: functionsUtils.Crypto(data.password, 'decipher'),
      registration: data.registration,
      departmentId: data.departmentId,
      jivochat: data.jivochat,
      status: data.status,
      app_login: data.app_login,
      created_by: data.created_by,
      cultures: []
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name || !values.email || !values.cpf || !values.departmentId || !values.password || !values.confirmPassword) {
        Swal.fire('Preencha todos os campos obrigatórios')
        return
      }
      if (values.password !== values.confirmPassword) {
        Swal.fire("As senhas devem ser iguais")
        return
      }

      let checkbox: any = document.getElementsByName('cultures');
      values.cultures = [];
      for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
          values.cultures.push(checkbox[i].value);
        }
      }
      let ObjProfiles;
      let input: any;
      const auxObject: any = [];
      let auxObject2: any = [];

      Object.keys(values.cultures).forEach((item) => {
        input = document.querySelector('select[name="profiles_' + values.cultures[item] + '"]');
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
        name: capitalize(values.name),
        email: values.email,
        cpf: values.cpf,
        tel: values.tel,
        password: values.password,
        registration: values.registration,
        departmentId: values.departmentId,
        jivochat: values.jivochat,
        status: values.status,
        app_login: values.app_login,
        cultures: auxObject,
        created_by: values.created_by
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Usuário atualizado com sucesso!')
          router.back();
        } else {
          Swal.fire(response.message);
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { let inputName: any = document.getElementById("name"); inputName.style.borderColor = 'red'; } else { let inputName: any = document.getElementById("name"); inputName.style.borderColor = ''; }
    if (!values.email) { let inputEmail: any = document.getElementById("email"); inputEmail.style.borderColor = 'red'; } else { let inputEmail: any = document.getElementById("email"); inputEmail.style.borderColor = ''; }
    if (!values.cpf) { let inputCpf: any = document.getElementById("cpf"); inputCpf.style.borderColor = 'red'; } else { let inputCpf: any = document.getElementById("cpf"); inputCpf.style.borderColor = ''; }
    // if (!values.registration) { let inpuRegistration: any = document.getElementById("registration"); inpuRegistration.style.borderColor= 'red'; } else { let inpuRegistration: any = document.getElementById("registration"); inpuRegistration.style.borderColor= ''; }
    if (!values.departmentId) { let inputDepartmentId: any = document.getElementById("departmentId"); inputDepartmentId.style.borderColor = 'red'; } else { let inputDepartmentId: any = document.getElementById("departmentId"); inputDepartmentId.style.borderColor = ''; }
    if (!values.password) { let inputPassword: any = document.getElementById("password"); inputPassword.style.borderColor = 'red'; } else { let inputPassword: any = document.getElementById("password"); inputPassword.style.borderColor = ''; }
    if (!values.confirmPassword) { let inputconfirmPassword: any = document.getElementById("confirmPassword"); inputconfirmPassword.style.borderColor = 'red'; } else { let inputconfirmPassword: any = document.getElementById("confirmPassword"); inputconfirmPassword.style.borderColor = ''; }

    if (values.password !== values.confirmPassword) {
      return true
    } else {
      return false
    }
  }

  function defineProfiles(culturedId: number, profiles: any) {
    Permissions[culturedId] = profiles.value;
    setPermissions(Permissions)
  }
  return (
    <>
      <Head>
        <title>Atualizar Usuário</title>
      </Head>
      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2 overflow-y-scroll"
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
                *Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="José Oliveira"
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
                placeholder="usuario@tmg.agr.br"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
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
                *Setor
              </label>
              <Select
                id="departmentId"
                name="departmentId"
                onChange={formik.handleChange}
                values={departmentsData}
                selected={data.departmentId}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Telefone
              </label>
              <InputMask
                mask=""
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

          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Senha
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
                *Confirmar senha
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
                value={Number(formik.values.jivochat)}
                selected={data.jivochat}
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
                  value={Number(formik.values.app_login)}
                  selected={data.app_login}
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
                culturesData.map((culture: ICultureUser) => (
                  <>
                    <div key={culture.id} className="flex items-center p-4 border border-solid border-gray-200 rounded shadow">
                      <div className="w-full text-xl">
                        <CheckBox
                          key={culture.id}
                          title={culture.name}
                          id={`culture_${culture.id}`}
                          name="cultures"
                          onChange={formik.handleChange}
                          value={culture.id}
                          defaultChecked={userCultures.includes(culture.id)}
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
                            dataSource={profilesData as any}
                            onChange={(e: any) => defineProfiles(culture.id, e)}
                            mode="Box"
                            fields={{
                              text: "name",
                              value: "id"
                            }}
                            value={Permissions[culture.id]}
                            placeholder={`Permissões de culturas para ${!formik.values.name ? 'Usuário' : formik.values.name}`}
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
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const token = context.req.cookies.token;
  // Fetch data from external API
  const requestOptions: object | any = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const response = await prisma.user.findFirst({
    where: {
      id: Number(context.query.id),
    },
    include: {
      users_permissions: {
        where: {
          userId: Number(context.query.id),
        },
        select: {
          id: true,

          profile: {
            select: {
              id: true,
              name: true,
            }
          },
          culture: {
            select: {
              id: true,
              name: true,
            }
          }
        },
      },
      department: {
        select: {
          id: true,
        }
      },
    }
  });

  const responseDepartment = await prisma.department.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    }
  });

  const responseProfile = await prisma.profile.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    }
  });

  const responseCulture = await prisma.culture.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    }
  });

  if (!response?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
        statusCode: 404
      }
    }
  }
  const data = {
    id: response.id,
    name: response.name,
    email: response.email,
    cpf: response.cpf,
    tel: response.tel,
    password: response.password,
    avatar: response.avatar,
    registration: response.registration,
    departmentId: response.departmentId,
    jivochat: response.jivochat,
    app_login: response.app_login,
    status: response.status,
    created_by: response.created_by,
    users_permissions: response.users_permissions.map(item => {
      return {
        id: item.id,

        id_profiles: item.profile.id,
        name_profiles: item.profile.name,

        id_cultures: item.culture.id,
        name_cultures: item.culture.name,
      }
    }),
  };

  const departmentsData = responseDepartment.map(department => {
    return {
      id: department.id,
      name: department.name
    }
  });

  const profilesData = responseProfile.map(profile => {
    return {
      id: profile.id,
      name: profile.name
    }
  });

  const culturesData = responseCulture.map(culture => {
    return {
      id: culture.id,
      name: culture.name
    }
  });

  return {
    props: {
      data,
      departmentsData,
      profilesData,
      culturesData,
    }
  }
}
