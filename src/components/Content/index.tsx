import { ReactNode } from "react";
import { Aside } from "../Aside";
import { MainHeader } from "../MainHeader";

interface IContentProps {
  children: never[] | ReactNode;
  headerCotent: never[] | ReactNode;
}

export function Content({ headerCotent, children }: IContentProps) {
  return (
    <>
      <MainHeader
          name="Juliana Aparecia da Silva"
          avatar="/images/person.jpg"
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
