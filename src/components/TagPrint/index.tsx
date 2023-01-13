import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQRCode } from "next-qrcode";
import { IoMdArrowBack } from "react-icons/io";

import { functionsUtils } from "../../shared/utils/functionsUtils";

import styles from "./styles.module.css";
import Etiqueta from "./etiqueta";
import BarCode from "./barcode";

import maoDireita from "../../../public/images/mao-direito.png";
import maoEsquerda from "../../../public/images/mao-esquerdo.png";
import algodao from "../../../public/images/algodao.png";

interface TagPrintProps {
  tagType: number;
  data: Array<any>;
}

function TagPrint({ tagType = 1, data = [] }: TagPrintProps) {
  const { Canvas } = useQRCode();
  const router = useRouter();

  const random = (max = 30, min = 10) => Math.floor(Math.random() * max) + min;

  function generateEAN8(npe: any) {
    let ean8 = "";
    let npe7Digits = String(npe);
    let countNPE = String(npe)?.length;

    if (countNPE < 7) {
      while (countNPE < 7) {
        npe7Digits = `0${npe7Digits}`;
        countNPE++;
      }
    }

    ean8 = `${npe7Digits}${functionsUtils?.generateDigitEAN8(npe7Digits)}`;
    return ean8;
  }

  if (tagType === 1) {
    const listTags = data.map((item: any) => (
      <div className="etiquetaModelo1">
        <div className="flexRow" style={{ fontSize: 16 }}>
          <div className="flex1">{item?.npe}</div>
          <div className="flex1">
            {item?.npe && <BarCode valor={generateEAN8(item?.npe)} />}
          </div>
          {/* INICIO CONTAGEM IMPRESSAO ETIQUETAS */}
          <div>
            <div
              style={{
                fontSize: 7,
                borderWidth: 1,
                borderRadius: 2,
                padding: 1,
                marginBottom: -2,
              }}
            >
              {item?.counter}
            </div>
          </div>
          {/* FIM CONTAGEM IMPRESSAO ETIQUETAS */}
        </div>
        <div className="flexRow" style={{ fontSize: 9 }}>
          <div className="flex1">{item?.genotipo?.name_genotipo}</div>
          <div>{item?.nca}</div>
        </div>
        <div style={{ fontSize: 7.5 }}>
          {item?.experiment?.local?.name_local_culture}-{item?.gli}-
          {item?.type_assay?.envelope[0]?.seeds}
          SMT
        </div>
      </div>
    ));

    return (
      <div className="todasEtiquetas" style={{ backgroundColor: "white" }}>
        <div className="notPrint">
          <div style={{ justifyContent: "flex-start" }}>
            <a
              onClick={() => router.back()}
              className={styles.card}
              style={{ padding: 10 }}
            >
              <IoMdArrowBack size={25} />
              <h2 style={{ margin: 10 }}>Voltar</h2>
            </a>
          </div>
        </div>
        <Etiqueta etiquetas={listTags} />
      </div>
    );
  }

  if (tagType === 2) {
    const listTags = data.map(() => (
      <div className="etiquetaModelo2">
        <div className="flexRow" style={{ fontSize: 16 }}>
          <div className="flexColumn" style={{ flex: 1 }}>
            <div style={{ fontSize: 16 }}>
              MT
              {random(999, 100)}
              SSS2
            </div>
            <div style={{ fontSize: 16 }}>SEQ-P</div>
            <div style={{ fontSize: 16 }}>
              QM
              {random(999, 100)}
            </div>
          </div>
          <div className="flexColumn">
            <Image
              src={random(2, 1) == 1 ? maoDireita : maoEsquerda}
              width={50}
              height={35}
            />
            <div style={{ fontSize: 24 }}>{random(0, 9)}A</div>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="todasEtiquetas" style={{ backgroundColor: "white" }}>
        <div className="notPrint">
          <div style={{ justifyContent: "flex-start" }}>
            <a
              onClick={() => router.back()}
              className={styles.card}
              style={{ padding: 10 }}
            >
              <IoMdArrowBack size={25} />
              <h2 style={{ margin: 0 }}>Voltar</h2>
            </a>
          </div>
        </div>
        <Etiqueta folhaHeight={24} etiquetaHeight={24} etiquetas={listTags} />
      </div>
    );
  }

  if (tagType === 3) {
    const listTags = data.map(() => (
      <div className="etiquetaModelo3">
        <div className="flexColumn" style={{ fontSize: 16 }}>
          <div style={{ textAlign: "center", fontSize: 34 }}>MTG</div>
          <div style={{ textAlign: "center", fontSize: 50 }}>HORTA</div>
          <div style={{ textAlign: "center", fontSize: 26 }}>QM-31</div>
          <div style={{ textAlign: "center", fontSize: 22 }}>
            16X04(P4)T-2021
          </div>
          <div style={{ textAlign: "center", fontSize: 30 }}>CX:1A</div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
            }}
          >
            <Canvas
              text={`${random(
                999999999999,
                100000000000
              )}TEXTO_MTG_HORTA_QM-31`}
              options={{
                type: "image/jpeg",
                quality: 0.3,
                level: "M",
                margin: 3,
                scale: 4,
                width: 80,
                color: {
                  dark: "#000000FF",
                  light: "#FFFFFFFF",
                },
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
          >
            2022/22
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              textAlign: "center",
            }}
          >
            <Image src={algodao} width={50} height={50} />
            <br />
            Algodão
          </div>
        </div>
      </div>
    ));

    return (
      <div className="todasEtiquetas" style={{ backgroundColor: "white" }}>
        <div className="notPrint">
          <div style={{ justifyContent: "flex-start" }}>
            <a
              onClick={() => router.back()}
              className={styles.card}
              style={{ padding: 10 }}
            >
              <IoMdArrowBack size={25} />
              <h2 style={{ margin: 0 }}>Voltar</h2>
            </a>
          </div>
        </div>
        <Etiqueta
          folhaHeight={70}
          etiquetaHeight={70}
          folhaQtdEtiqueta={1}
          etiquetas={listTags}
        />
      </div>
    );
  }

  return (
    <Head>
      <title>Impressão de etiquetas</title>
    </Head>
  );
}

export default TagPrint;
