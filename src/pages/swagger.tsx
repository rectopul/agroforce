import Head from 'next/head';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function Swagger() {
  return (
    <div className='container mx-auto'>
      <Head>
        <title>Next Swagger Doc Demo App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SwaggerUI url="/api/doc" />
    </div>
  );
}