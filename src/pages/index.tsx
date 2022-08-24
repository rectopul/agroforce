import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { AiOutlineContainer } from 'react-icons/ai';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   RadialLinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import { Bubble, PolarArea } from 'react-chartjs-2';
// import { faker } from '@faker-js/faker';

import { Content } from '../components/Content';

// ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, RadialLinearScale, PointElement);

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: false,
//       position: 'top' as const,
//     },
//     title: {
//       display: false,
//       text: 'Chart.js Bar Chart',
//     },
//     tooltip: {
//       enabled: true,
//     },
//   },
// };

// export const options1 = {
//   scales: {
//     y: {
//       beginAtZero: true,
//     },
//   },
// };

// export const data1 = {
//   datasets: [
//     {
//       label: 'Red dataset',
//       data: Array.from({ length: 50 }, () => ({
//         x: faker.datatype.number({ min: -100, max: 100 }),
//         y: faker.datatype.number({ min: -100, max: 100 }),
//         r: faker.datatype.number({ min: 5, max: 20 }),
//       })),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Blue dataset',
//       data: Array.from({ length: 50 }, () => ({
//         x: faker.datatype.number({ min: -100, max: 100 }),
//         y: faker.datatype.number({ min: -100, max: 100 }),
//         r: faker.datatype.number({ min: 5, max: 20 }),
//       })),
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

// export const data2 = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.5)',
//         'rgba(54, 162, 235, 0.5)',
//         'rgba(255, 206, 86, 0.5)',
//         'rgba(75, 192, 192, 0.5)',
//         'rgba(153, 102, 255, 0.5)',
//         'rgba(255, 159, 64, 0.5)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

export default function Listagem() {
  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  setCookie(null, 'token', userLogado.token, {
    maxAge: 86400 * 7,
    path: '/',
  });

  setCookie(null, 'userId', userLogado.id, {
    maxAge: 86400 * 7,
    path: '/',
  });

  setCookie(null, 'cultureId', userLogado.userCulture.cultura_selecionada, {
    maxAge: 86400 * 7,
    path: '/',
  });

  setCookie(null, 'safraId', userLogado.safras.safra_selecionada, {
    maxAge: 86400 * 7,
    path: '/',
  });

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Content contentHeader={[]} moduloActive="">
        <div className="flex bg-blue-480 text-white p-3 rounded-md items-center">
          <AiOutlineContainer className="mr-2" />
          Dashboard
        </div>
        {/* <div className="flex items-end m-auto">
          <Image src="/images/logo.png" alt="GOM" width={150} height={150} />
        </div> */}

        {/* <div className="flex flex-row justify-around">
          <div style={{
            display: 'flex',
            flex: 1,
            maxWidth: '50%',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Bubble options={options1} data={data1} />
          </div>
          <div style={{ width: '40%', marginTop: 20 }}>
            <PolarArea data={data2} />
          </div>
        </div> */}
      </Content>
    </>
  );
}
