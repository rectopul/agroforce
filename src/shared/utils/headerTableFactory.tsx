import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

interface IHeaderTableFactory {
  name?: any;
  title: any;
  orderList: any;
  fieldOrder: any;
  handleOrder: Function;
  [x: string]: any;
}

export default function headerTableFactoryGlobal({
  setloading,
  name,
  title,
  orderList,
  fieldOrder,
  handleOrder,
  ...rest
}: IHeaderTableFactory) {
  return {
    title: (
      <div className="flex items-center">
        <button
          type="button"
          className="font-medium text-gray-900"
          onClick={() =>{
            handleOrder(title, orderList, name);
          }}
        >
          {name}
        </button>
        {fieldOrder === name && (
          <div className="pl-2">
            {orderList !== 0 ? (
              orderList === 1 ? (
                <AiOutlineArrowDown size={15} />
              ) : (
                <AiOutlineArrowUp size={15} />
              )
            ) : null}
          </div>
        )}
      </div>
    ),
    field: title,
    sorting: false,
    ...rest,
  };
}
