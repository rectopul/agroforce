interface EtiquetaProps {
  folhaWidth: number;
  folhaHeight: number;
  folhaQtdEtiqueta: number;
  etiquetaWidth: number;
  etiquetaHeight: number;
  etiquetas: Array<any>;
}

function Etiqueta({
  folhaWidth = 106,
  folhaHeight = 13,
  folhaQtdEtiqueta = 2,
  etiquetaWidth = 106,
  etiquetaHeight = 13,
  etiquetas = [],
}: EtiquetaProps) {
  const getEtiquetas = (folhai: number) => {
    const etiquetasFolha = [];

    for (let i = 0; i < folhaQtdEtiqueta; i++) {
      etiquetasFolha.push(<div
        className="etiqueta"
        style={{
          width: `${etiquetaWidth}mm`,
          height: `${etiquetaHeight}mm`,
        }}
      >
        {etiquetas[folhai + i]}
                          </div>);
    }

    return etiquetasFolha;
  };

  const getListagem = () => {
    const folhas: any = [];

    etiquetas.forEach((e, i) => {
      if (i % folhaQtdEtiqueta !== 0) return;

      if (folhas.length > 0) {
        folhas.push(<div className="notPrint" style={{ height: 15 }} />);
      }

      folhas.push(<div
        className="imprimir"
        style={{
          width: `${folhaWidth}mm`,
          height: `${folhaHeight}mm`,
        }}
      >
        {getEtiquetas(i)}
                  </div>);
    });

    return folhas;
  };

  return (
    <>
      <div
        className="notPrint"
        style={{
          width: `${folhaWidth - 8}mm`,
          border: '#ccc 1px solid',
          margin: '4mm',
          borderRadius: 6,
          padding: 12,
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={() => window.print()}
      >
        Clique aqui para imprimir
      </div>
      {getListagem()}
    </>
  );
}

export default Etiqueta;
