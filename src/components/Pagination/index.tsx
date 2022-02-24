interface IPagination {
  setCurrentPage: ((e: number) => void);
  pages: number;
  disabled?: boolean;
}

export function Pagination({ setCurrentPage, pages, disabled }: IPagination) {  
  return (
    <div className='w-full flex items-center gap-2 pl-5 pt-5'>
      {   
        Array.from(Array(pages), (items, index) => {
          console.log(index % pages)
          console.log(`pages - ${index}`)
          return (
            <button className='flex justify-center items-center
              h-5 w-12 
              p-4
              text-white
              font-medium text-xs
              leading-tight
              shadow-lg
              border-2 border-white
              rounded-lg
              transition duration-150
              hover:shadow-lg
              hover: bg-blue-600
              hover:shadow-lg
              hover:text-gray-50
              hover:shadow-lg
            '
              value={index}
              onClick={() => setCurrentPage(index)} // e.target.value
              disabled={disabled}
              key={index}
            >
              { index + 1 }
            </button>
          )
        }
      )}
    </div>
  );
}
