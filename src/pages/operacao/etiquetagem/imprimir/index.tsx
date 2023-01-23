import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import TagPrint from '../../../../components/TagPrint';

function PrintToTag() {
  const router = useRouter();

  const [tagType, setTagType] = useState(1);
  const [data, setData] = useState([]);

  const parcelsToPrint = JSON.parse(
    localStorage.getItem('parcelasToPrint') as string,
  );

  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:20 ~ useEffect ~ parcelsToPrint', parcelsToPrint);
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
