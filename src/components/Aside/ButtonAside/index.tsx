import { useRouter } from 'next/router'
import Link from 'next/link';
import { ReactNode } from "react";

interface AnchorAsideProps {
  title: string;
  href: any;
  icon: string | ReactNode;
  active?: boolean;
}

export function ButtonAside({
  title,
  icon,
  href,
  active,
}: AnchorAsideProps) {
  return (
    active ? (
      <Link href={href}>
        <a
          id="lista"
          className="flex flex-col
          items-center
          text-sm
          text-center
          bg-indigo-500
          text-blue-600
          transition delay-150
          -translate-y-1
          scale-110 duration-300
        ">
          { icon }
          { title }
        </a>
      </Link>
   ) : (
      <Link href={href}>
      <a 
        id="lista"
        className="flex flex-col
        items-center
        text-center
        text-sm
        text-gray-300
        transition delay-150
        hover:-translate-y-1 hover:text-blue-600 
        hover:scale-110 hover:bg-indigo-500 duration-300
      ">
        { icon }
        { title }
      </a>
      </Link>
   )
  );
}
