import Link from 'next/link';
import { ReactNode } from 'react';

interface ITabProps {
  titleTab: string;
  valueTab: ReactNode;
  statusTab: boolean;
  href: string;
  handleStatusTabs: (title: string, status: boolean) => void;
}

export function TabHeader({
  titleTab, valueTab, statusTab, handleStatusTabs, href,
}: ITabProps) {
  return (
    statusTab ? (
      <Link href={href}>
        <a
          onClick={() => handleStatusTabs(titleTab, !statusTab)}
          className="
        h-full
        flex
        items-center
        gap-1
      "
        >
          <div className={`
          h-3/5 w-12
          flex 
          justify-center 
          items-center
          border 
          border-white 
          rounded-md 
          bg-blue-600
          rounded-bl-full	
          rounded-br-full	
          rounded-tr-full	
          rounded-tl-full
        `}>
            <span className={`
          text-white 
            text-2xl
          `}>
              {valueTab}
            </span>
          </div>

          <span className={`
        border-white 
          text-sm 
        text-white
        `}>
            {titleTab}
          </span>
        </a>
      </Link>
    ) : (
      <Link href={href}>
        <a
          onClick={() => handleStatusTabs(titleTab, !statusTab)}
          className="
        h-full
        flex
        items-center
        gap-1
      "
        >
          <div className={`
          h-3/5 w-12
          flex 
          justify-center 
          items-center
          border 
          border-gray-300 
          rounded-md 
          bg-gray-300
          rounded-bl-full	
          rounded-br-full	
          rounded-tr-full	
          rounded-tl-full
        `}>
            <span className={`
          text-gray-700 
            text-2xl
          `}>
              {valueTab}
            </span>
          </div>

          <span className="border-gray-300 text-sm text-gray-50">{titleTab}</span>
        </a>
      </Link>
    )
  );
}
