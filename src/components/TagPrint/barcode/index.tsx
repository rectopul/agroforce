import {useBarcode} from "next-barcode";

const BarCode = ({
    valor = 'barcode',
  }) => {

  let { inputRef } = useBarcode({
    value: valor,
    options: {
      displayValue: false,
      background: '#ffffff',
      height: 18,
      width: 1,
      margin: 0
    }
  });

  return (
    <svg ref={inputRef} />
  )
}

export default BarCode
