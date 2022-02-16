import '../styles/tailwind.css';
import { MainHeader } from '../components/MainHeader';
import { Aside } from '../components/Aside';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainHeader />
      <div className='flex flex-row'>
        <Aside />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
