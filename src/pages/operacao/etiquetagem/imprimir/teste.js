import Head from "next/head";
import { useRouter } from "next/router";

import TagPrint from "../../../../components/TagPrint";

const data = {
  counter: 1,
  experiment: {
    experimentName: "2022/22_EDS(2)56/02_PR201CB01_01",
    status: "ETIQ. EM ANDAMENTO",
    local: { name_local_culture: "PR201CB01" },
  },
  foco: { name: "SUL" },
  genotipo: { name_genotipo: "P95R51RR", gmr: "5.4", bgm: "53" },
  gli: "EDS(2)56/02",
  group: {
    id: 8,
    id_safra: 10,
    id_foco: 6,
    created_by: 2,
    created_at: "2023-01-19T00:32:05.302Z",
  },
  id: 8155,
  idGenotipo: 89,
  lote: {
    id: 1391,
    created_by: 2,
    created_at: "2023-01-19T00:29:31.253Z",
    id_genotipo: 89,
    cod_lote: "110000000938",
  },
  nca: "202114285271",
  npe: 10201,
  nt: 5,
  rep: 1,
  safra: { safraName: "2022/22" },
  sequencia_delineamento: {
    id: 12605,
    id_delineamento: 14,
    repeticao: 1,
    sorteio: 41,
    nt: 5,
  },
  status: "IMPRESSO",
  status_t: "T",
  tableData: { id: 0, disabled: false, checked: true },
  tecnologia: { name: "INTACTA(RR2+BT)", cod_tec: "02" },
  type_assay: {
    name: "ED",
    envelope: [
      {
        created_at: "2023-01-20T13:07:51.895Z",
        created_by: 2,
        id: 1,
        id_safra: 32,
        id_type_assay: 1,
        seeds: 100,
      },
    ],
  },
};

function PrintToTag() {
  const router = useRouter();
  const labels = router?.query?.i ? parseInt(router?.query?.i) : 2;
  const tagType = 1;

  return (
    <>
      <Head>
        <title>Impressão de etiquetas</title>
      </Head>
      <TagPrint tagType={tagType} data={Array(labels).fill(data)} />
    </>
  );
}

export default PrintToTag;
