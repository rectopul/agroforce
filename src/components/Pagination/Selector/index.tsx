import { BiFilterAlt } from "react-icons/bi";

interface ISelectorPagination {
  itensPerPage: number;
  setItensPerPage: ((e: number) => void);
}

export function SelectorPagination({ itensPerPage, setItensPerPage }: ISelectorPagination) {
  return (
    <div className="
      w-full h-10
      flex items-center justify-center gap-2
      bg-blue-600
      rounded-lg
      shadow-lg
      border-2 border-white
      text-white
      pl-2
    ">
      <BiFilterAlt size={24} />
      <select value={itensPerPage} onChange={(e) => setItensPerPage(Number(e.target.value))}
        className="
          w-full h-full
          bg-blue-600
          rounded-lg
          text-white
        ">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}
