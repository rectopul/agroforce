import { useRouter } from 'next/router'
import { ReactNode } from "react";

interface AnchorAsideProps {
  title: string;
  link: any;
  icon: string | ReactNode;
  active?: boolean;
}

export function ButtonAside({
  title,
  icon,
  link,
  active,
}: AnchorAsideProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  }

  return (
    active ? (
      <button 
        id="lista"
        onClick={() => handleClick()}
        className="flex flex-col
        items-center
        text-sm
        bg-indigo-500
        text-blue-600
        transition delay-150
        -translate-y-1
        scale-110 duration-300
      ">
        { icon }
        { title }
      </button>
   ) : (
      <button
        id="lista"
        onClick={() => handleClick()}
        className="flex flex-col
        items-center
        text-sm
        text-gray-300
        transition delay-150
        hover:-translate-y-1 hover:text-blue-600 
        hover:scale-110 hover:bg-indigo-500 duration-300
      ">
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg> */}
        { icon }
        { title }
      </button>
   )
  );
}
