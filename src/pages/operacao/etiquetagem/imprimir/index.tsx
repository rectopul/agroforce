import Head from 'next/head';
import { useState } from 'react';

import TagPrint from '../../../../components/TagPrint';

const testData = [{ id: 1 }, { id: 2 }, { id: 3 }];

function PrintToTag() {
  const [tagType, setTagType] = useState(1);
  const [data, setData] = useState(testData);

  // RECEBER OS DADOS VIA LOCALSTORAGE
  // TIPO DE ETIQUETA E ARRAY COM DADOS

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
