import Head from "next/head";
import { FaHandPointLeft } from "react-icons/fa";
import { Content } from "src/components";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useRef } from "react";

export default function Etiqueta() {

  const pdfExportComponent: any = useRef(null)
  const exportPDF = () => {
    pdfExportComponent.current.save()
  }

  return (
    <>
      <Head>Etiqueta</Head>
      <Content contentHeader={[]}  >
        <PDFExport ref={pdfExportComponent} fileName="etiqueta_2_2016-06-01" paperSize="A4" >
          {/* <table>
            <tbody>
              <tr>
                <td>
                  <div className="w-[416px] h-[192px] flex-wrap text-lg ">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                  </div>
                </td>                
              </tr>
              <tr>
                <td>
                  <div className="w-[416px] h-[192px] flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-72 h-16 w-16" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                  </div>
                </td>                
              </tr>
              <tr>
                <td>
                  <div className="w-[416px] h-[192px] flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-72 h-16 w-16" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                  </div>
                </td>                
              </tr>
              <tr>
                <td>
                  <div className="w-[416px] h-[192px] flex-wrap text-lg">
                    <span className="absolute">MT405SS02</span> <FaHandPointLeft className="ml-72 h-16 w-16" />
                    <span>SEQ-P</span> <br />
                    <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                  </div>
                </td>          
              </tr>
            </tbody>
          </table> */}
          <div className="h-[420px] w-[384px] flex item-align-left ">
            <table className="w-96">
              <tbody>
                <tr>
                  <td>
                    <div className="relative w-[416px] h-[192px] flex-wrap text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                    </div>
                  </td>
                  <td>
                    <div className=" w-[416px] h-[192px] flex-wrap text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </PDFExport>
        <button onClick={exportPDF} className="bnt mt-52"> Teste </button>
      </Content>
    </>
  )
}