import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { userService } from '../../services';

import {
  Container,
  Video,
  Content,
  Button,
  ContainerButton,
  TextButton,
  ContainerSocial,
  ContainerError,
  ImgQrCode,
} from './styles';

import Loading from '../../components/Loading';

export default function Login() {
  const router = useRouter();

  const [hoverButton, setHoverButton] = useState(false);
  const [hoverIconFB, setHoverIconFB] = useState(false);
  const [hoverIconIG, setHoverIconIG] = useState(false);
  const [hoverIconIN, setHoverIconIN] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.userValue) {
      router.push('/');
    }
  }, [router]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    login: Yup.string().required('Login is required'),
    password: Yup.string().required('Password is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const {
    register, handleSubmit, setError, formState,
  } = useForm(formOptions);
  const { errors }: any = formState;

  async function onSubmit({ login, password }: any) {
    setLoading(true);

    await userService.login(login, password).then(() => {
      // get return url from query parameters or default to '/'
      const returnUrl = router.query.returnUrl || '/';
      router.push(returnUrl as string);
    })
      .catch((error) => {
        setError('apiError', { message: error });
      });

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      {loading && <Loading />}
      <img
        src="/images/qrcode_tela_login.png"
        style={{
          width: 100,
          height: 100,
          position: 'fixed',
          zIndex: 3,
          bottom: 30,
          left: 30,
        }}
      />

      <div style={Container}>
        <video
          autoPlay
          loop
          muted
          style={{
            top: -50,
            right: 0,
            bottom: 0,
            left: 0,
            position: 'fixed',
            width: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/images/qrcode_login.webm" type="video/webm" />
        </video>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(150, 150, 150, 0.5)',
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 20,
            paddingLeft: 25,
            paddingRight: 25,
            width: '35%',
            height: 380,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
          className="shadow-lg"
        >
          <img src="/images/logo.png" className="w-30 h-14 self-center" />

          {errors.apiError && (
          <div style={ContainerError}>
            <span style={{ color: '#fff' }}>
              {errors.apiError?.message}
            </span>
          </div>
          )}

          <form style={{ width: '100%', marginTop: 10 }} onSubmit={handleSubmit(onSubmit)}>
            <div style={{ height: 35 }}>
              <input
                {...register('login')}
                placeholder="Usuário"
                type="login"
                name="login"
                required
                className="h-full w-full px-2 flex-1 block text-gray-900 rounded bg-white border-blue-600 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div style={{ height: 35, marginTop: 10, marginBottom: 10 }}>
              <input
                {...register('password')}
                placeholder="Senha"
                type="password"
                name="password"
                required
                className="h-full w-full px-2 flex-1 block text-gray-900 rounded bg-white border-blue-600 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <Link href="/trocar-senha">
                <a className="text-blue-600">Esqueci minha senha - I forgot my password - Olvide mi contraseña</a>
              </Link>

              <button
                type="button"
                className="shadow-lg"
                style={{ ...Button, backgroundColor: hoverButton ? '#fff' : '#609f51' }}
                onMouseEnter={() => setHoverButton(true)}
                onMouseLeave={() => setHoverButton(false)}
              >
                <span style={{ ...TextButton, color: hoverButton ? '#609f51' : '#fff' }}>Conectar</span>
              </button>

              <a href="https://agroforce.com.br/" style={{ marginTop: 10 }} target="_blank" rel="noreferrer">
                <img src="/images/agroforce2.png" className="w-30 h-10 self-center" />
              </a>

              <div style={ContainerSocial}>
                <a
                  href="https://www.facebook.com/agroforcesoftware"
                  title="Facebook"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHoverIconFB(true)}
                  onMouseLeave={() => setHoverIconFB(false)}
                >
                  <FaFacebook color={hoverIconFB ? '#609f51' : '#fff'} size={25} />
                </a>
                <a
                  href="https://www.instagram.com/agroforcesoftware/"
                  title="Instagram"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHoverIconIG(true)}
                  onMouseLeave={() => setHoverIconIG(false)}
                >
                  <FaInstagram color={hoverIconIG ? '#609f51' : '#fff'} size={25} />
                </a>
                <a
                  href="https://www.linkedin.com/company/agroforce-tecnologia/"
                  title="Linkedin"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHoverIconIN(true)}
                  onMouseLeave={() => setHoverIconIN(false)}
                >
                  <FaLinkedin color={hoverIconIN ? '#609f51' : '#fff'} size={25} />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
