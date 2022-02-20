import '../styles/tailwind.css';
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
