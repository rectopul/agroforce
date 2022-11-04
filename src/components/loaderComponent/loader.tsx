import React from 'react';
import Image from 'next/image';
import rotate from '../../../public/images/Reload.svg';

export default function Loader(){
  return(
    <div width="100%">
    <Image
      src={rotate}
      alt="Loading"
      width="50%"
      height="50%"
    />
    TESTE
    </div>
  )
}
