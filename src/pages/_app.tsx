import '../styles/tailwind.css';
import { MainHeader } from '../components/MainHeader';
import { Aside } from '../components/Aside';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
