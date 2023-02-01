/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useState } from 'react';
import { capitalize } from '@mui/material';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import { RiUserSettingsLine } from 'react-icons/ri';
import InputMask from 'react-input-mask';
import Swal from 'sweetalert2';
import { prisma } from '../../../api/db/db';
import { userService } from '../../../../services';
import { functionsUtils } from '../../../../shared/utils/functionsUtils';
import {
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

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

interface IUserProps {
  id: number;
  name: string;
  login: string;
  cpf: string;
  email: string;
  tel: string;
  password: string;
  registration: number;
  departmentId: number;
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

export default function AtualizarUsuario({
  departmentsData,
  data,
  profilesData,
  culturesData,
}: IData) {
  const { TabsDropDowns } = ITabs.default;
  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG'
    && tab.data.map((i) => i.labelDropDown === 'Usuários')
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const userCultures: any = [];
  const userPermissions: any = [];

  if (data.users_permissions) {
    Object.keys(data.users_permissions).forEach((_, item) => {
      userCultures.push(data.users_permissions[item].id_cultures);
      if (userPermissions[data.users_permissions[item].id_cultures]) {
        userPermissions[data.users_permissions[item].id_cultures] = [
          data.users_permissions[item].id_profiles,
          Number(
            userPermissions[data.users_permissions[item].id_cultures].join(),
          ),
        ];
      } else {
        userPermissions[data.users_permissions[item].id_cultures] = [
          data.users_permissions[item].id_profiles,
        ];
      }
    });
  }
  const [Permissions, setPermissions] = useState<any>(userPermissions);

  function validateInputs(values: any) {
    if (!values.name) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
    if (!values.login) {
      const inputLogin: any = document.getElementById('login');
      inputLogin.style.borderColor = 'red';
    } else {
      const inputLogin: any = document.getElementById('login');
      inputLogin.style.borderColor = '';
    }
    if (!values.cpf) {
      const inputCpf: any = document.getElementById('cpf');
      inputCpf.style.borderColor = 'red';
    } else {
      const inputCpf: any = document.getElementById('cpf');
      inputCpf.style.borderColor = '';
    }
    if (!values.departmentId) {
      const inputDepartmentId: any = document.getElementById('departmentId');
      inputDepartmentId.style.borderColor = 'red';
    } else {
      const inputDepartmentId: any = document.getElementById('departmentId');
      inputDepartmentId.style.borderColor = '';
    }
    if (!values.password) {
      const inputPassword: any = document.getElementById('password');
      inputPassword.style.borderColor = 'red';
    } else {
      const inputPassword: any = document.getElementById('password');
      inputPassword.style.borderColor = '';
    }
    if (!values.confirmPassword) {
      const inputconfirmPassword: any = document.getElementById('confirmPassword');
      inputconfirmPassword.style.borderColor = 'red';
    } else {
      const inputconfirmPassword: any = document.getElementById('confirmPassword');
      inputconfirmPassword.style.borderColor = '';
    }

    if (values.password !== values.confirmPassword) {
      return true;
    }
    return false;
  }

  const formik = useFormik<IUserProps>({
    initialValues: {
      id: data.id,
      name: data.name,
      login: data.login,
      cpf: data.cpf,
      email: data.email,
      tel: data.tel,
      password: functionsUtils.Crypto(data.password, 'decipher'),
      confirmPassword: functionsUtils.Crypto(data.password, 'decipher'),
      registration: data.registration,
      departmentId: data.departmentId,
      status: data.status,
      created_by: data.created_by,
      cultures: [],
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (
        !values.name
        || !values.login
        || !values.cpf
        || !values.departmentId
        || !values.password
        || !values.confirmPassword
      ) {
        Swal.fire(
          'Preencha todos os campos obrigatórios destacados em vermelho.',
        );
        setLoading(false);
        return;
      }
      if (values.password !== values.confirmPassword) {
        Swal.fire('As senhas devem ser iguais');
        setLoading(false);
        return;
      }

      const checkbox: any = document.getElementsByName('cultures');
      values.cultures = [];
      for (let i = 0; i < checkbox.length; i += 1) {
        if (checkbox[i].checked) {
          values.cultures.push(checkbox[i].value);
        }
      }
      let ObjProfiles;
      let input: any;
      const auxObject: any = [];
      let auxObject2: any = [];

      Object.keys(values.cultures).forEach((item: any) => {
        input = document.querySelector(
          `select[name="profiles_${values.cultures[item]}"]`,
        );
        auxObject2 = [];
        for (let i = 0; i < input.options.length; i += 1) {
          if (input.options[i].selected) {
            auxObject2.push(input.options[i].value);
          }
        }
        ObjProfiles = {
          cultureId: values.cultures[item],
          profiles: auxObject2,
        };
        auxObject.push(ObjProfiles);
      });

      await userService
        .update({
          id: values.id,
          name: capitalize(values.name),
          login: values.login,
          cpf: values.cpf,
          email: values.email,
          tel: values.tel,
          password: values.password,
          registration: values.registration,
          departmentId: values.departmentId,
          cultures: auxObject,
          created_by: values.created_by,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Usuário atualizado com sucesso!');
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
        });
    },
  });

  function defineProfiles(culturedId: number, profiles: any) {
    Permissions[culturedId] = profiles.value;
    setPermissions(Permissions);
  }
  return (
    <>
      <Head>
        <title>Atualizar Usuário</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar usuário</h1>

          <div
            className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="José Oliveira"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Login
              </label>
              <Input
                type="login"
                placeholder="usuario@tmg.agr.br"
                id="login"
                name="login"
                onChange={formik.handleChange}
                value={formik.values.login}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
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
                  py-1 px-2
                  text-gray-900
                  text-xs
                  leading-tight
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              />
            </div>
          </div>

          <div
            className="w-full
            flex
            justify-around
            gap-6
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Email
              </label>
              <Input
                type="text"
                placeholder="usuario@tmg.agr.br"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
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

            <div className="w-full h-6">
              <label className="block text-gray-900 text-sm font-bold mb-1">
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
              <label className="block text-gray-900 text-sm font-bold mb-1">
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
                  py-1 px-2
                  text-gray-900
                  text-xs
                  leading-tight
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              />
            </div>
          </div>

          <div
            className="w-full
            flex
            justify-between
            gap-6
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
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
              <label className="block text-gray-900 text-sm font-bold mb-1">
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

          <div
            className="w-full
            flex
            justify-between
            gap-6
            mb-4
          "
          />

          <div className="w-full">
            <h2 className="text-gray-900 text-2xl mb-4">
              Permissões de Culturas
            </h2>
            <div className="w-full grid grid-cols-3 gap-2">
              {culturesData.map((culture: ICultureUser) => (
                <div
                  key={culture.id}
                  className="flex items-center p-2 border border-solid border-gray-200 rounded shadow"
                >
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
                    <h4 className="block text-gray-900 text-sm font-bold mb-1">
                      Perfil
                    </h4>
                    <div>
                      <MultiSelectComponent
                        id={`profiles_${culture.id}`}
                        name={`profiles_${culture.id}`}
                        dataSource={profilesData as any}
                        onChange={(e: any) => defineProfiles(culture.id, e)}
                        mode="Box"
                        fields={{
                          text: 'name',
                          value: 'id',
                        }}
                        value={Permissions[culture.id]}
                        placeholder={`Permissões de culturas para ${
                          !formik.values.name ? 'Usuário' : formik.values.name
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-5
          "
          >
            <div className="w-40">
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
                onClick={() => { setLoading(true); }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  // Fetch data from external API
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
            },
          },
          culture: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      department: {
        select: {
          id: true,
        },
      },
    },
  });

  const responseDepartment = await prisma.department.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const responseProfile = await prisma.profile.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const responseCulture = await prisma.culture.findMany({
    where: {
      status: 1,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!response?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
        statusCode: 404,
      },
    };
  }
  const data = {
    id: response.id,
    name: response.name,
    login: response.login,
    cpf: response.cpf,
    email: response.email,
    tel: response.tel,
    password: response.password,
    avatar: response.avatar,
    registration: response.registration,
    departmentId: response.departmentId,
    status: response.status,
    created_by: response.created_by,
    users_permissions: response.users_permissions.map((item: any) => ({
      id: item.id,

      id_profiles: item.profile.id,
      name_profiles: item.profile.name,

      id_cultures: item.culture.id,
      name_cultures: item.culture.name,
    })),
  };

  const departmentsData = responseDepartment.map((department: any) => ({
    id: department.id,
    name: department.name,
  }));

  const profilesData = responseProfile.map((profile: any) => ({
    id: profile.id,
    name: profile.name,
  }));

  const culturesData = responseCulture.map((culture: any) => ({
    id: culture.id,
    name: culture.name,
  }));

  return {
    props: {
      data,
      departmentsData,
      profilesData,
      culturesData,
    },
  };
};
