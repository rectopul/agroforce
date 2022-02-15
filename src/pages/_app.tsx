import '../styles/tailwind.css';
import { Aside } from '../components/Aside';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className='flex flex-row'>
        <Aside />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
