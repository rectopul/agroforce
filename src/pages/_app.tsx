import '../styles/tailwind.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userService  } from '../services';
import PermisssionGate from "../utils/PermissionUser";

export default App;

function App({ Component, pageProps, permissions, user }: any) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // run auth check on initial load
        authCheck(router.asPath);

        // set authorized to false to hide page content while changing routes
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // run auth check on route change
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    function authCheck(url: any) {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

    return (
        <>
            <PermisssionGate
                permissions={[
                    'canEdit',
                    'canDelete',
                    'canSave',
                ]} 
                user={{ permissions: ['canSave'] }}
                >
                {authorized &&
                    <Component {...pageProps} />
                }
            </PermisssionGate>
        </>
    );
}
