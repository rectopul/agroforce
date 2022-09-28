import React, { useEffect, useState, useRef } from "react";
import { MdOutlineKeyboardArrowDown, MdClose } from "react-icons/md";

export function SelectAutoComplete() {
  const [open, setOpen] = useState(false);
  const [list] = useState([
    "red",
    "yellow",
    "white",
    "grey",
    "green",
    "blue",
    "silver",
  ]);
  const [search, setSearch] = useState("");

  const inputRef = useRef();

  function handleSelect(item) {
    setSearch(item);
    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <button
        className="flex shadow
              appearance-none
              bg-white bg-no-repeat
              border border-solid border-gray-300
              rounded
              w-full
              py-1 px-2
              text-gray-900
              text-xs
              leading-tight
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
              "
        onClick={() => setOpen(true)}
      >
        <input
          className="flex"
          placeholder="Selecione"
          style={{ flex: 1 }}
          ref={inputRef}
          value={search}
          onBlur={() => setTimeout(() => setOpen(false), 300)}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex w-10">
          {/* {search !== "" ? (
            <button
              onClick={() => {
                // setOpen(false);
                setSearch("");
              }}
            >
              <MdClose size={18} />
            </button>
          ) : (
            <div className="w-5" />
          )} */}
          <MdOutlineKeyboardArrowDown size={20} />
        </div>
      </button>
      {open && (
        <div
          className="select-open 
        shadow
        appearance-none
        bg-white bg-no-repeat
        border border-solid border-gray-300
        rounded
        text-gray-900
        text-xs
        leading-tight
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
        >
          {/* <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
          {search == "" && (
            <button className="item" onClick={() => handleSelect("")}>
              Selecione
            </button>
          )}
          {list
            .filter((e) => e.toLowerCase().includes(search.toLowerCase()))
            .map((i) => (
              <button className="item" onClick={() => handleSelect(i)}>
                {i}
              </button>
            ))}
        </div>
      )}
    </>
  );
}
