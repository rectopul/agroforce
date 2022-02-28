import { 
  ColumnDirective,
  ColumnsDirective, 
  GridComponent, 
  Page, 
  Inject, 
  Filter,
  Group,
  Grid,
  Toolbar,
  PdfExport,
  ExcelExport,
  Search,
  SearchSettingsModel,
} from '@syncfusion/ej2-react-grids';

import * as React from 'react';
import { useGetUsers } from 'src/hooks/useGetUsers';


interface IGridProps {
  item: {
    id: string;
  }
}

export default function Teste() {
  const {
    items
  // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useGetUsers();

  let grid: Grid | null;
  const excelExtensio: string = (".xlsx" || ".xlsm" || ".xlsb" || ".xltx");

  const toolbarClick = async (args: IGridProps) => {
    if (grid) {
      if(args.item.id.includes('pdfexport')) {
        await grid.pdfExport({
          fileName: 'Usuarios.pdf',
          exportType: 'CurrentPage'
        })
      } else if(args.item.id.includes('excelexport')) {
        await grid.excelExport({
          fileName: `Usuarios${excelExtensio}`,
          exportType: 'CurrentPage',
          header: {
            headerRows: 1,
            rows: [
              {
                cells: [{
                  colSpan: 6,
                  value: "TMG Usuários",
                  style: { fontColor: "#C67878", fontSize: 20, hAlign: 'Center', bold: true,  },
                }]
              }
            ]
          },
          footer: {
            footerRows: 1,
            rows: [
              {
                cells: [{ 
                  colSpan: 6,
                  value: "Thank you for your job!",
                  style: {
                    hAlign: 'Center', 
                    bold: true,
                  } 
                }]
              }
            ]
          }
        })
      }
    }
  };

  const searchOptions: SearchSettingsModel = {
    fields: ['name', 'email', 'login', 'status'],
    ignoreCase: true,
    key: '',
    operator: 'contains'
  };



  let initialGridLoad: boolean = true;
  function dataBound() {
    if (initialGridLoad && grid) {
      initialGridLoad = false;
      const pager: any = document.getElementsByClassName('e-gridpager');
      let topElement: any;
      if (grid.allowGrouping || grid.toolbar) {
        topElement = grid.allowGrouping ? document.getElementsByClassName('e-groupdroparea') :
        document.getElementsByClassName('e-toolbar');
      } else {
        topElement = document.getElementsByClassName('e-gridheader');
      }
      grid.element.insertBefore(pager[0], topElement[0]);
    }
  }

  return(
   <div style={{ margin: '10%', marginTop: '5%' }}>
      <GridComponent dataSource={items}
        dataBound={dataBound}
        ref={g => grid = g}
        allowPaging={true}
        allowFiltering={true}
        allowPdfExport={true}
        allowExcelExport={true}
        allowGrouping={true}
        pageSettings={{pageSize: 10, pageSizes: true, enableQueryString: true }}
        toolbar={['PdfExport', 'ExcelExport', 'Search']}
        toolbarClick={toolbarClick}
        searchSettings={searchOptions}
      >
        
        <ColumnsDirective>
          <ColumnDirective field='id' headerText='ID' width='12' textAlign="Left"/>
          <ColumnDirective field='name' headerText='Nome' width='100' textAlign="Left"/>
          <ColumnDirective field='login' headerText='Login' width='100' textAlign="Left"/>
          <ColumnDirective field='email' headerText='E-mail' width='100' textAlign="Left"/>
          <ColumnDirective field='telefone' headerText='Telefone' width='100' textAlign="Left"/>
          <ColumnDirective field='status' headerText='Status' width='100' textAlign="Left"/>
        </ColumnsDirective>
        <Inject services={[
          Page, 
          Search,
          Toolbar, 
          Filter, 
          Group,
          PdfExport,
          ExcelExport
        ]} />
      </GridComponent>
   </div>
  ) 
};
