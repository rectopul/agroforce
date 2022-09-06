// import { GetStaticProps, InferGetStaticPropsType } from 'next';

// import { createSwaggerSpec } from 'next-swagger-doc';
// import SwaggerUI from 'swagger-ui-react';
// import 'swagger-ui-react/swagger-ui.css';

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const spec: Record<string, any> = createSwaggerSpec({
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'NextJS Swagger',
//         version: '0.1.0',
//       },
//     },
//   });
//   return {
//     props: {
//       spec,
//     },
//   };
// };

// function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
//   return <SwaggerUI spec={spec} />;
// }

function ApiDoc() {
  console.log('teste');
}

export default ApiDoc;
