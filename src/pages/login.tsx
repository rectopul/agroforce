import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { userService } from '../services';




export default Login;

function Login() {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue) {
            router.push('/');
        }
    }, [router]);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit({ email, password }: any) {
      console.log(email, password)
      await userService.login(email, password).then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl as string);
      })
      .catch(error => {
          setError('apiError', { message: error });
      });
    }

    return (
  
        <>
          <Head>
            <title>Home</title>
          </Head>
    
          <div className='w-screen h-screen flex items-stretch bg-gray-200'>
            <main className='flex bg-light'>
              <div className='flex flex-col gap-8 w-full items-center justify-center px-24
              '>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Nuseed" className='w-80 h-44 self-center'/>
    
                <form className='w-80
                  flex
                  flex-col
                  justify-between
                  gap-4 
                  mt-24'
                   onSubmit={handleSubmit(onSubmit)}>
                  <div className='
                    h-40
                    flex
                    flex-col
                    justify-start
                    gap-10
                  '>
                    <div className='h-10'>
                      <span className="block text-sm font-medium text-blue-600">Usuário</span>
                      <input
                        {...register('email')}
                        placeholder='Usuário'
                        type="email"
                        name="email"
                        required
                        className="h-full w-full
                          px-2
                          flex-1 
                          block
                          text-gray-900
                          rounded
                          bg-white
                          border-blue-600
                          focus:ring-indigo-500
                          focus:border-indigo-500
                      "/>
                    </div>
    
                    <div className='h-10'>
                      <span className="block text-sm font-medium text-blue-600">Senha</span>
                      <input
                         {...register('password')}
                          placeholder='Senha'
                          type="password"
                          name="password"
                          required
                          className="h-full w-full
                          px-2
                          flex-1 
                          block
                          text-gray-900
                          rounded
                          bg-white
                          border-blue-600
                          focus:ring-indigo-500
                          focus:border-indigo-500
                        "/>
                    </div>
                  </div>
    
                  <div className='h-10
                    w-2/4
                    flex
                  '>
                    <Button 
                      type='submit'
                      disabled={formState.isSubmitting}
                      value='Conectar'
                      onClick={() => {}} 
                      bgColor="bg-blue-600"
                      textColor="white"
                    />
                  </div>
                  {errors.apiError &&  <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>  }
                </form>
    
                <a href="#" className='text-blue-600 mb-64
                '>
                  Esqueci minha senha - I forgot my password - Olvide mi contraseña
                </a>
              </div>
            </main>
    
            <aside className='flex-initial'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/agroforce.png" alt="teste" className='w-screen h-screen' />
            </aside>
          </div>
        </>
    );
}
