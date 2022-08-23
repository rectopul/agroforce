import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import '../../public/nprogress.css';
import { userService } from '../services';
import '../shared/styles/App.css';
import '../shared/styles/tailwind.css';
// import Modal from 'react-modal';
import PermissionGate from '../shared/utils/PermissionUser';

// Modal.setAppElement('#__next');

function App({
  Component, pageProps, permissions, user,
}: any) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  function authCheck(url: any) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login', '/trocar-senha'];
    const path = url.split('?')[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  useEffect(() => {
    const handleStart = (url: any) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <PermissionGate
      permissions={['canEdit', 'canDelete', 'canSave']}
      user={{ permissions: ['canSave'] }}
    >

      {authorized && <Component {...pageProps} />}
    </PermissionGate>
  );
}

export default App;
