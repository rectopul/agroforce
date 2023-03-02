import { HiOutlineClipboardList, HiOutlineMail } from 'react-icons/hi';
import { RiUserSettingsFill } from 'react-icons/ri';
import { FaBars } from 'react-icons/fa';
import { IoFingerPrintSharp } from 'react-icons/io5';
import { BiSearchAlt } from 'react-icons/bi';
import { GiThreeLeaves } from 'react-icons/gi';
import { VscGraph } from 'react-icons/vsc';
import { BsGear } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { ButtonAside } from './ButtonAside';

const versionApp = '0.0.30.7';

export function Aside({ moduloActive }: any) {
  const aArray = versionApp.split('.');

  const prev = aArray.splice(0, aArray.length - 1);
  const next = aArray.splice(-1);

  // aArray.toLowerCase() === aArray[aArray.length-1].toLowerCase();

  return (
    <aside
      style={{ height: 'auto' }}
      className="h-screen w-32
      bg-gray-450
    "
    >
      <nav
        className="flex flex-col gap-6
        pt-4
      "
      >
        <ButtonAside
          title="Configurações"
          icon={<BsGear size={32} />}
          href="/config/tmg/usuarios"
          active={moduloActive === 'config'}
        />
        <ButtonAside
          title="Lista"
          icon={<HiOutlineClipboardList size={32} />}
          href="/listas/rd"
          active={moduloActive === 'listas'}
        />
        <ButtonAside
          title="Operação"
          icon={<RiUserSettingsFill size={32} />}
          href="/operacao/ambiente"
          active={moduloActive === 'operacao'}
        />
        <ButtonAside
          title="Relatórios"
          icon={<FaBars size={32} />}
          href="/logs"
          active={moduloActive === 'relatorios'}
        />
        {/*

        <ButtonAside
          title='Ensaio'
          icon={<IoFingerPrintSharp size={32} />}
          href='config/'
        />

        <ButtonAside
          title="Sorteio"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
          href='config/'
        />

        <ButtonAside
          title='Experimento'
          icon={ <BiSearchAlt size={32} />}
          href='config/'
        />

        <ButtonAside
          title='Envelope'
          icon={ <HiOutlineMail  size={32} />}
          href='config/'
        />

       <ButtonAside
          title='Plantio'
          icon={ <GiThreeLeaves  size={32} />}
          href='config/'
        />

        <ButtonAside
          title='Notificações e Relatórios'
          icon={ <VscGraph  size={32} />}
          href='relatorios'
        /> */}
      </nav>
      <div className="fixed bottom-2 left-7">
        <span className="text-xs text-center text-gray-300">
          Versão:
          {' '}
          {prev.join('.')}
          <span style={{ color: '#00567b' }}>
            .
            {next}
          </span>
        </span>
      </div>
    </aside>
  );
}
