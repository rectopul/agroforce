/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { capitalize } from '@mui/material';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiUserPlus } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';
import InputMask from 'react-input-mask';
import Swal from 'sweetalert2';
import { userService } from '../../../../services/user.service';
import {
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../../components';
import IDepartment from '../../../../../props/departmentDTO';
import * as ITabs from '../../../../shared/utils/dropdown';

interface ICulture {
  id: number;
  name: string;
}
interface IProfile {
  id: number;
  name: string;
}
interface IUsers {
  id?: number;
  name: string;
  login: string;
  cpf: string;
  tel: string;
  email: string;
  password: string;
  avatar: string;
  registration: number;
  departmentId: number;
  status?: number;
  created_by: number | any;
  confirmPassword: string;

  cultures: object | any;
}
export interface IData {
  profiles: IProfile[];
  departments: IDepartment[];
  Cultures: ICulture[];
}

export default function NovoUsuario({
  departments,
  profiles,
  Cultures,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('config');

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const maskTel = '(99)99999-9999' || '(99)9999-9999';
  const userLogado = JSON.parse(localStorage.getItem('user') as string);

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
  }

  const formik = useFormik<IUsers>({
    initialValues: {
      name: '',
      avatar: '',
      login: '',
      cpf: '',
      email: '',
      tel: '',
      password: '',
      confirmPassword: '',
      registration: 0,
      departmentId: 0,
      status: 1,
      created_by: userLogado.id,
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
        return;
      }
      if (values.password !== values.confirmPassword) {
        Swal.fire('As senhas devem ser iguais');
        return;
      }

      let ObjProfiles;
      let input: any;
      const auxObject: any = [];
      let auxObject2: any = [];

      Object.keys(values.cultures).forEach((item) => {
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
        .create({
          avatar:
            'https://media-exp1.licdn.com/dms/image/C4E0BAQGtzqdAyfyQxw/company-logo_200_200/0/1609955662718?e=2147483647&v=beta&t=sfA6x4MWOhWda5si7bHHFbOuhpz4ZCTdeCPtgyWlAag',
          name: capitalize(values.name),
          login: values.login,
          cpf: values.cpf,
          email: values.email,
          tel: values.tel,
          password: values.password,
          registration: values.registration,
          departmentId: values.departmentId,
          status: values.status,
          created_by: values.created_by,
          cultures: auxObject,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Usuário cadastrado com sucesso!');
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  return (
    <>
      <Head>
        <title>Novo usuário</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo usuário</h1>
          </div>

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
                type="text"
                placeholder="José Oliveira"
                id="name"
                name="name"
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
                mask="999.999.999-99"
                // required
                placeholder="111.111.111-11"
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
                type="email"
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
                values={[{ id: null, name: 'Selecione...' }, ...departments]}
                id="departmentId"
                name="departmentId"
                onChange={formik.handleChange}
                value={formik.values.departmentId}
                selected={false}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Telefone
              </label>
              <InputMask
                mask={maskTel}
                type="tel"
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
              {Cultures.map((culture, index) => (
                <div
                  key={index}
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
                    />
                  </div>

                  <div className="w-full">
                    <h4 className="block text-gray-900 text-sm font-bold mb-1">
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
                          text: 'name',
                          value: 'id',
                        }}
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

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const { token } = req.cookies;
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiDepartment = await fetch(`${baseUrl}/departament`, requestOptions);
  const apiProfile = await fetch(`${baseUrl}/profile`, requestOptions);
  const apiCulture = await fetch(
    `${publicRuntimeConfig.apiUrl}/culture`,
    requestOptions,
  );

  const departments = await apiDepartment.json();
  const profiles = await apiProfile.json();
  const Cultures = (await apiCulture.json()).response;

  return { props: { departments, profiles, Cultures } };
};
