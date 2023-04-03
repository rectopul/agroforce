/* eslint-disable no-unused-expressions */
import { HiOutlineClipboardList, HiOutlineMail } from 'react-icons/hi';
import { RiUserSettingsFill } from 'react-icons/ri';
import { FaBars } from 'react-icons/fa';
import { IoFingerPrintSharp } from 'react-icons/io5';
import { BiSearchAlt } from 'react-icons/bi';
import { GiThreeLeaves } from 'react-icons/gi';
import { VscGraph } from 'react-icons/vsc';
import { BsGear } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ButtonAside } from './ButtonAside';
import { asidePermissions } from '../../shared/utils/perm_can_do';

const versionApp = '0.0.36.0';

export function Aside({ moduloActive }: any) {
  const aArray = versionApp.split('.');
  const [config, setConfig] = useState<any>([
    '/config/tmg/usuarios',
    '/config/tmg/cultura',
    '/config/tmg/safra',
    '/config/tmg/genotipo',
    '/config/tmg/lote',
    '/config/ensaio/foco',
    '/config/tmg/setor',
    '/config/ensaio/tecnologia',
    '/config/ensaio/tipo-ensaio',
    '/config/delineamento',
    '/config/delineamento/sequencia-delineamento',
    '/config/local/local',
    '/config/quadra',
    '/config/quadra/layout-quadra',
  ]);
  const [list, setList] = useState<any>([
    '/listas/rd',
    '/listas/ensaios/ensaio',
    '/listas/ensaios/genotipos-ensaio',
    '/listas/experimentos/experimento',
    '/listas/experimentos/parcelas-experimento',
  ]);
  const [operation, setOperation] = useState<any>([
    '/operacao/ambiente',
    '/operacao/etiquetagem',
  ]);
  const [logs, setLogs] = useState<any>([
    '/logs',
  ]);
  const prev = aArray.splice(0, aArray.length - 1);
  const next = aArray.splice(-1);

  async function set(value: any, state: any) {
    state(value);
  }

  useEffect(() => {
    (async () => {
      const newConfig = await asidePermissions(config);
      await set(newConfig, setConfig);
    })();

    (async () => {
      const newList = await asidePermissions(list);
      await set(newList, setList);
    })();

    (async () => {
      const newOperations = await asidePermissions(operation);
      await set(newOperations, setOperation);
    })();

    (async () => {
      const newLogs = await asidePermissions(logs);
      await set(newLogs, setLogs);
    })();
  }, []);

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
        {config.length > 0 && (
        <ButtonAside
          title="Configurações"
          icon={<BsGear size={32} />}
          href={config.length ? config[0] : '/config/tmg/usuarios'}
          active={moduloActive === 'config'}
        />
        )}
        {list.length > 0 && (
        <ButtonAside
          title="Lista"
          icon={<HiOutlineClipboardList size={32} />}
          href={list.length ? list[0] : 'listas/rd'}
          active={moduloActive === 'listas'}
        />
        )}
        {operation.length > 0 && (
        <ButtonAside
          title="Operação"
          icon={<RiUserSettingsFill size={32} />}
          href={operation.length ? operation[0] : '/operacao/ambiente'}
          active={moduloActive === 'operacao'}
        />
        )}
        {logs.length > 0 && (
        <ButtonAside
          title="Relatórios"
          icon={<FaBars size={32} />}
          href={logs.length ? logs[0] : '/logs'}
          active={moduloActive === 'relatorios'}
        />
        )}
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
