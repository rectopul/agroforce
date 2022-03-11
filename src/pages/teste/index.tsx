import { ReactNode, useState } from 'react';
import { Content, DropDown, TabHeader, ToolTip } from 'src/components';

import { tabs, dropDowns, teste, nada } from '../../utils/statics/tabs';

export default function Teste() {
  console.log(tabs[0]);
  
  return (
    <>
      <Content   headerCotent={  
        <TabHeader data={tabs} dataDropDowns={dropDowns} />
      }>
      </Content>
    </>
  );
}
