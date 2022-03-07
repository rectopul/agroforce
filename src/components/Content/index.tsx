import { ReactNode } from "react";
import { FaLaptopHouse } from "react-icons/fa";

import { Aside } from "../Aside";
import { MainHeader } from "../MainHeader";
import { Select } from "../Select";

interface IContentProps {
  children: never[] | ReactNode;
  headerCotent: never[] | ReactNode;
}

export function Content({ headerCotent, children }: IContentProps) {
  // const plantas = [ "Milho", "Algodão", "Soja" ];
  const safras = [{id: "03/19", name:"03/19" }, { id: "04/20", name: "03/21"}];

  return (
    <>
      <MainHeader
        name="Juliana Aparecia da Silva"
        avatar="/images/person.jpg"

        headerSelects={
          <Select values={safras} selected={false} />
        }
      >
        { headerCotent }
      </MainHeader>

      <div className='flex flex-row'>
        <Aside />
        <div className="flex flex-col
            w-container-all-main-contents
            h-content
            p-8

            border border-gray-700
            bg-gray-300
          ">
          { children }
        </div>
      </div>

    </>
  );
}
