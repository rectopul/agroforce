import {
    convertDateToExcelFormat,
    convertDateToSQLDatetime,
    convertDateToSQLDatetimeUTC,
    converterDateParaNumeroInicial,
    converterEpochToDate,
    converterParaDataBanco,
    converterParaTimestamp,
    converterParaTimestampISO,
    convertSerialDateToJSDate
} from "../../../shared/utils/formatDateEpoch";
import {tableClasses} from "@mui/material";

export default function Test() {

    const tempo1 = 45134.5108443750; // 27/07/2023  12:15:36 (EXCEL)
    const tempo2 = 44902.7656572917; // 07/12/2022  18:22:33 (EXCEL)
    const tempo3 = 45000.3799305556; // 15/03/2023  09:07:06 (EXCEL)
    const tempo4 = 44823.7041708912; // 19/09/2022  16:54:00 (EXCEL)
    const tempo5 = 45134.510844375; // 27/07/2023  12:15:37 (EXCEL)

    return <div>
        <style jsx>{`
          table, th, td {
            border: 1px solid black;
          }
          .container {
            margin: 50px;
          }

          p {
            color: blue;
          }
        `}</style>
        <h2>Teste</h2>
        <br/>
        <br/>{tempo1}<br/>
        <table cellSpacing={1} border={1} style={{border: '1px solid black'}} className={`${tableClasses}`}>
            <tr>
                <td>DateToSQLDatetime:</td>
                <td>{convertDateToSQLDatetime(convertSerialDateToJSDate(tempo1), true)}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>UTC:</td>
                <td>{convertSerialDateToJSDate(tempo1).toUTCString()}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>ISO:</td>
                <td>{convertSerialDateToJSDate(tempo1).toISOString()}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>Timestamp ISO:</td>
                <td>{converterParaTimestampISO(tempo1)}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>Timestamp:</td>
                <td>{converterParaTimestamp(tempo1)}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>EpochToDate:</td>
                <td>{converterEpochToDate(tempo1).toUTCString()}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>DateParaNumeroInicial:</td>
                <td>{converterDateParaNumeroInicial(converterEpochToDate(tempo1))}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>converterParaDataBanco:</td>
                <td>{converterParaDataBanco(tempo1)}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>SQLDatetime ISO:</td>
                <td>{convertDateToSQLDatetime(convertSerialDateToJSDate(tempo1))}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>SQLDatetime UTC:</td>
                <td>{convertDateToSQLDatetime(convertSerialDateToJSDate(tempo1), true)}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>date Excel:</td>
                <td>{convertDateToExcelFormat(convertSerialDateToJSDate(tempo1))}</td>
                <td>Correto</td>
            </tr>
            <tr>
                <td>SQLDatetimeUTC:</td>
                <td>{convertDateToSQLDatetimeUTC(tempo1)}</td>
                <td>Correto</td>
            </tr>
        </table>
        
        <br/>{tempo2}<br/>
        {convertSerialDateToJSDate(tempo2).toUTCString()}<br/>
        {converterParaDataBanco(tempo2)}<br/>
        <br/>{tempo3}<br/>
        {convertSerialDateToJSDate(tempo3).toUTCString()}<br/>
        {converterParaDataBanco(tempo3)}<br/>
        <br/>{tempo4}<br/>
        {convertSerialDateToJSDate(tempo4).toUTCString()}<br/>
        {converterParaDataBanco(tempo4)}<br/>
    </div>
}
// Fri, 28 Jul 2023 15:15:36 GMT
// Thu, 27 Jul 2023 12:15:36 GMT