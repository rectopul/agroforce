import * as React from "react";
import {useEffect, useState} from "react";
import {semaforoService} from "../../services";

let semaforo_timeout: any = null;

// @ts-ignore
export function Semaforo1({ acao }) {
  
  const [liberado, setLiberado] = useState(false);
  
  let verificaSemaforo = async () => {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    
    await semaforoService.verifica(global.sessao, acao, userLogado.id).then((response: any) => {
      if (response.status === 200) {
        setLiberado(true);
      } else {
        setLiberado(false);
      }
    });
  }
  
  let updateSemaforo = () => {
    if (semaforo_timeout != null) clearTimeout(semaforo_timeout);

    semaforo_timeout = setTimeout(() => {
      verificaSemaforo();
      updateSemaforo();
    }, 10 * 1000);
  }
  
  useEffect(() => {
    verificaSemaforo();
    updateSemaforo();
    
    return () => {
      if (semaforo_timeout != null) clearTimeout(semaforo_timeout);
      semaforoService.finaliza(global.sessao, acao)
    }
  }, [])
  
  return (
    <div className="h-10 w-full ml-2" style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
      <div style={{
        width: 12,
        height: 12,
        border: '2px solid green',
        backgroundColor: liberado ? 'green' : 'transparent',
        borderRadius: 6,
        margin: 4,
      }}>
      </div>
      <div style={{
        width: 12,
        height: 12,
        border: '2px solid red',
        backgroundColor: !liberado ? 'red' : 'transparent',
        borderRadius: 6,
        margin: 4,
      }}
      onClick={() => {
        semaforoService.finaliza(global.sessao, acao)
      }}
      >
      </div>
    </div>
  );
}

// @ts-ignore
export function Semaforo2({ acao }) {
  const [liberado, setLiberado] = useState(false);
  
  let verificaSemaforo = async () => {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    
    await semaforoService.verifica(global.sessao, acao, userLogado.id).then((response: any) => {
      console.log('semaforoService.verifica',response);
      if (response.status === 200) {
        setLiberado(true);
      } else {
        setLiberado(false);
        if (response.message) alert(response.message);
      }
    });
  }
  
  let sorteiaSemaforo = async () => {

    await semaforoService.testeSemaforoSorteio().then((response: any) => {
      
      console.log('testeSemaforoSorteio', response);
      
      if (response.status === 200) {
        //alert('SORTEIO EM ANDAMENTO');
      } else {
        if (response.message) 
          alert(response.message);
      }
      
    });
    
    /*const userLogado = JSON.parse(localStorage.getItem('user') as string);
    let acao = 'sorteia';
    let referencia = 'npe';
    let codReferencia:any = '1';
    
    await semaforoService.verificaItem(global.sessao, acao, referencia, codReferencia, userLogado.id).then((response: any) => {
      console.log('semaforoService.sorteia',response);
      if (response.status === 200) {
        //setLiberado(true);
        alert('Processo Iniciado');
      } else {
        //setLiberado(false);
        if (response.message) alert(response.message);
      }
    });

    codReferencia = 2;

    await semaforoService.verificaItem(global.sessao, acao, referencia, codReferencia, userLogado.id).then((response: any) => {
      console.log('semaforoService.sorteia', response);
      if (response.status === 200) {
        //setLiberado(true);
        alert('Processo Iniciado');
      } else {
        //setLiberado(false);
        if (response.message) alert(response.message);
      }
    });*/
    
  }
  
  let finalizaSorteio = async () => {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    let acao = 'sorteia';
    
    await semaforoService.finalizaItem(global.sessao, acao).then((response: any) => {
      console.log('semaforoService.finaliza',response);
      if (response.status === 200) {
        //setLiberado(true);
        alert('Processo Finalizado');
      } else {
        //setLiberado(false);
        if (response.message) 
          alert(response.message);
      }
    });
  }
  
  useEffect(() => {
    return () => {
      semaforoService.finaliza(global.sessao, acao)
    }
  }, [])
  
  return (
    <div className="h-10 w-full ml-2" style={{
      display: 'flex',
      flexDirection: 'row',
    }}>

      <div
        style={{
          padding: 12,
          border: '2px solid green',
          backgroundColor: 'green',
          borderRadius: 6,
          margin: 4,
          height: 50,
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => {
          sorteiaSemaforo()
        }}
      >
        SORTEAR
      </div>

      <div
          style={{
            padding: 12,
            border: '2px solid green',
            backgroundColor: 'green',
            borderRadius: 6,
            margin: 4,
            height: 50,
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => {
            finalizaSorteio()
          }}
      >
        FINALIZAR SORTEIO
      </div>
      
      
      {liberado ?
      <div 
        style={{
          padding: 12,
          border: '2px solid red',
          backgroundColor: 'red',
          borderRadius: 6,
          margin: 4,
          height: 50,
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => {
          semaforoService.finaliza(global.sessao, acao)
          setLiberado(false);
        }}
      >
        DESBLOQUEAR
      </div> :
      <div 
        style={{
          padding: 12,
          border: '2px solid green',
          backgroundColor: 'green',
          borderRadius: 6,
          margin: 4,
          height: 50,
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => {
          verificaSemaforo()
        }}
      >
        BLOQUEAR
      </div>}
    </div>
  );
}
