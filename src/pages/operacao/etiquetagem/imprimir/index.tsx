import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import TagPrint from '../../../../components/TagPrint';

export type Message = {
  type: string;
  value: string;
}

function PrintToTag() {
  const router = useRouter();
  const PARENT_APP_URL = '/operacao/etiquetagem/parcelas';

  const [tagType, setTagType] = useState(1);
  const [data, setData] = useState([]);

  const parcelsToPrint = JSON.parse(
    localStorage.getItem('parcelasToPrint') as string,
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // if (event.origin !== PARENT_APP_URL) {
      //   // skip other messages from(for ex.) extensions
      //   return;
      // }

      const message: Message = event.data;
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // https://github.com/andriishupta/cross-origin-iframe-communication-with-nextjs/blob/main/packages/child-app/pages/index.tsx
  const postMessage = (message: Message) => {
    window.parent.postMessage(message, '*');
  };

  useEffect(() => {
    if (parcelsToPrint?.length > 0) {
      setData(parcelsToPrint);
    } else {
      Swal.fire('Não existe parcelas para imprimir.');
      Swal.fire({
        title: 'Não existe parcelas para imprimir.',
      }).then((result) => {
        if (result.isConfirmed) {
          router.back();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      window.print();
      localStorage.removeItem('parcelasToPrint');
      setTimeout(() => {
        postMessage({ type: 'printed', value: '1' });// close print
      }, 1000);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Impressão de etiquetas</title>
      </Head>
      <TagPrint tagType={tagType} data={data} />
    </>
  );
}

export default PrintToTag;
