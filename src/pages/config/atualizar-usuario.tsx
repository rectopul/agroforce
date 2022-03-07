import Head from "next/head";
import { GetServerSideProps } from "next";
import { useFormik } from "formik";
import { BsCheckLg } from "react-icons/bs";

import { 
  IDepartment,
  IProfile, 
  IUsers
} from "./props";

import { 
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  Select2,
  TabHeader
} from "../../components";
import { userService } from "src/services";

export interface IData {
  profiles: IProfile[];
  departments: IDepartment[];
  userEdit: IUsers;
}

export default function AtualizarUsuario({ departments, profiles, userEdit }: IData) {
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const optionSorN =  [{id: 1, name: "sim"}, {id: 0, name: "Não"}];

  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
  ];

  const formik = useFormik<IUsers>({
    initialValues: {
      id: userEdit[0].id,
      name: userEdit[0].name,
      email: userEdit[0].email,
      cpf: userEdit[0].cpf,
      tel: userEdit[0].tel,
      password: userEdit[0].password,
      confirmPassword: '',
      profiles: [],
      registration: userEdit[0].registration,
      departmentId: userEdit[0].departmentId,
      jivochat: userEdit[0].jivochat,
      status: userEdit[0].status,
      app_login: userEdit[0].app_login,
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

      Object.keys(values.profiles).forEach((_, item) => {
        ObjProfiles = {profileId: values.profiles[item]}
        auxObject.push(ObjProfiles);
      });

      userService.updateUsers({
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
          alert("Usuário atualizado com sucesso!");
        } else {

        }
      })
    },
  });
  
  return (
    <>
      <Head>
        <title>Atualizar Usuário</title>
      </Head>
      <Content
        headerCotent={
          <TabHeader data={tabs} />
        }
      >
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
                {
                  profiles.map((profile) => (
                    <>
                      <CheckBox
                        key={profile.id}
                        title={profile.name}
                        id={`profiles.${profile.id}`}
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

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código do usuário
              </label>
              <Input 
                disabled
                type="text"
                value={userLogado.id}
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Nome usuário
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
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
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

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Setor
              </label>
              <Select2
                id="department.id"
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
                selected={userEdit[0].jivochat}
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
                  selected={userEdit[0].app_login}
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

export const getServerSideProps:GetServerSideProps = async ({req}) => {
  // const  token  =  req.cookies.token;
  // console.log("ALA" + token)
  // Fetch data from external API
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM0LCJpYXQiOjE2NDY0ODkxNDksImV4cCI6MTY0NzA5Mzk0OX0.YrbCWGV0ZN0R9VD9OKOJ35afYsWXM1zeAEDzPzGXxws` }
  };
  const resD = await fetch('http://localhost:3000/api/user/departament', requestOptions)
  const resP = await fetch('http://localhost:3000/api/user/profile', requestOptions)
  const resU = await fetch('http://localhost:3000/api/user/' + 1, requestOptions)
  const departments = await resD.json();
  const profiles = await resP.json();
  const userEdit = await resU.json();

  return { props: { departments, profiles, userEdit } }
}
