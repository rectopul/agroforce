import Head from "next/head";
import { FaHandPointLeft } from "react-icons/fa";
import { Content } from "src/components";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useRef } from "react";

export default function Etiqueta() {

  const pdfExportComponent = useRef(null)
  const exportPDF = () => {
    pdfExportComponent.current.save()
  }

  return (
    <>
      <Head>Etiqueta</Head>
      <Content contentHeader={[]}  >
        <PDFExport ref={pdfExportComponent} fileName="etiqueta_2_2016-06-01" paperSize="A4">
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>
                <td>
                  <div className="w-52 h-24 flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-36 h-8 w-8" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-6 mb-8 text-3xl">3B</strong>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>

        </PDFExport>
        <button onClick={exportPDF} className="bnt"> Teste </button>
      </Content>
    </>
  )
}