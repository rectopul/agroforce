import React, { useEffect, useState, useRef } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export function SelectAutoComplete({ data = [], value = '', onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const inputRef = useRef();

  function handleSelect(item) {
    setSearch(item);
    setOpen(false);
    onChange(item);
  }

  useEffect(() => {
    if (open) {
      inputRef.current.focus();
    }
  }, [open]);

  const classContainer = 'flex shadow appearance-none bg-white bg-no-repeat border border-solid border-gray-300 rounded w-full py-1 px-2 text-gray-900 text-sm leading-tight focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';
  const classInput = 'flex flex-1 focus:shadow-0 focus:outline-0';
  const classContainerIcon = 'flex w-5';
  const classButtonItem = 'flex flex-1 bg-white align-center pb-2 pt-2 pr-2 pl-2 hover:bg-gray-300 cursor-pointer';
  const classContainerItems = 'flex flex-col overflow-hidden overflow-y-auto absolute max-h-24 shadow appearance-none bg-white bg-no-repeat border border-solid border-gray-300 rounded text-gray-900 text-sm leading-tight focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  return (
    <div>
      <button
        className={classContainer}
        id="classContainerSelectAuto"
        onClick={() => setOpen(true)}
      >
        <input
          className={classInput}
          placeholder="Selecione"
          ref={inputRef}
          value={search}
          onBlur={() => setTimeout(() => setOpen(false), 300)}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={classContainerIcon}>
          <MdOutlineKeyboardArrowDown size={20} />
        </div>
      </button>
      {open && (
        <div
          className={classContainerItems}
          style={{
            zIndex: 1,
            width: document.getElementById('classContainerSelectAuto')
              .clientWidth,
          }}
        >
          {search == '' && (
            <button
              className={classButtonItem}
              onClick={() => handleSelect('')}
            >
              Selecione
            </button>
          )}
          {data
            ?.filter((e) => e?.toLowerCase()?.includes(search?.toLowerCase()))
            ?.map((i) => (
              <button
                className={classButtonItem}
                onClick={() => handleSelect(i)}
              >
                {i}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
