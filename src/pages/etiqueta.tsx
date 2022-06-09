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
      <PDFExport ref={pdfExportComponent} fileName="etiqueta_2" paperSize={'auto'}>
        <div className="w-[3508px] h-[2480px] rotate-90">
          <div className="w-full h-full text-[350px] p-4 ">
            <span className="absolute mt-14">MT405SS02</span> <FaHandPointLeft className="flex ml-auto h-[865px] w-[865px]" />
            <span>SEQ-P</span> <br />
            <span>QM123_VG-2L</span> <strong className="pl-[180px] mb-16 text-[750px]">3B</strong>
          </div>
        </div>
      </PDFExport>
      <button onClick={exportPDF} className="bnt mt-52"> Teste </button>
    </>
  )
}

//A4 PAPER BY CALCULATOR
{/* <div className="w-full h-full text-8xl p-4">
            <span className="absolute mt-14">MT405SS02</span> <FaHandPointLeft className="flex ml-auto h-72 w-72" />
            <span>SEQ-P</span> <br />
            <span>QM123_VG-2L</span> <strong className="pl-32 mb-16 text-[250px]">3B</strong>
          </div> */}




{/* <div className="h-[1260px] w-[384px] flex item-align-left ">
            <table className="w-96">
              <tbody>
                <tr>
                  <td>
                    <div className="w-[790px] h-[1120px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                    </div>
                  </td>
                  <td>
                    <div className=" w-[416px] h-[192px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3B</strong>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="w-[416px] h-[192px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3C</strong>
                    </div>
                  </td>
                  <td>
                    <div className=" w-[416px] h-[192px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3C</strong>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="w-[416px] h-[192px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3C</strong>
                    </div>
                  </td>
                  <td>
                    <div className=" w-[416px] h-[192px] text-lg rotate-90">
                      <span className="absolute">MT405SS02</span> <FaHandPointLeft className="flex ml-72 h-16 w-16" />
                      <span>SEQ-P</span> <br />
                      <span>QM123_VG-2L</span> <strong className="pl-36 mb-16 text-6xl">3C</strong>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

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