import React, { useState, useEffect, useRef } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from "react-icons/md";

export function SelectMultiple({ data = [], values = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, function () {
    setOpen(false);
  });

  function handleSelect(item) {
    let newValues = values;

    if (data !== values) setCheckAll(false);

    const itemChecked = values?.some((x) => x === item);

    if (itemChecked) {
      newValues = values?.filter((i) => i !== item);
    } else {
      newValues.push(item);
    }

    onChange(newValues);
  }

  function handleSelectAll(check) {
    setCheckAll(check);

    let newValues = [];

    if (check === true) {
      newValues = data;
    } else {
      newValues = [];
    }

    onChange(newValues);
  }

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  function useOutsideAlerter(ref, callback) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // use callback
          callback();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const classContainer =
    "flex shadow appearance-none bg-white bg-no-repeat border border-solid border-gray-300 rounded w-full py-1 px-2 text-gray-900 text-sm leading-tight focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
  const classInput = "flex flex-1 focus:shadow-0 focus:outline-0";
  const classContainerIcon = "flex w-5";
  const classContainerItems =
    "flex flex-col overflow-hidden overflow-y-auto absolute max-h-24 shadow appearance-none bg-white bg-no-repeat border border-solid border-gray-300 rounded text-gray-900 text-sm leading-tight focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
  const classButtonItem =
    "flex bg-white align-center pb-2 pt-2 pr-2 pl-2 hover:bg-gray-300 cursor-pointer";
  const classItemText = "ml-1 text-sm";

  return (
    <div
      ref={wrapperRef}
      //onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className={classContainer}
        id="classContainer"
        onClick={() => setOpen(!open)}
      >
        <div className={classInput}>
          {values?.length > 0 ? `${values?.length} item(s)` : "Selecione"}
        </div>
        <div className={classContainerIcon}>
          <MdOutlineKeyboardArrowDown size={20} />
        </div>
      </button>
      {open && (
        <div
          className={classContainerItems}
          style={{
            zIndex: 1,
            width: document.getElementById("classContainer").clientWidth,
          }}
        >
          <button
            //type="button"
            className={classButtonItem}
            onClick={() => handleSelectAll(!checkAll)}
          >
            <div>
              {checkAll ? (
                <MdCheckBox size={22} className="text-blue-600" />
              ) : (
                <MdCheckBoxOutlineBlank size={22} color="#000" />
              )}
            </div>
            <span className={classItemText}>TODOS</span>
          </button>
          {data?.map((i) => (
            <button
              //type="button"
              className={classButtonItem}
              onClick={() => handleSelect(i)}
              //onBlur={() => setOpen(false)}
            >
              <div>
                {values?.some((x) => x === i) ? (
                  <MdCheckBox size={22} className="text-blue-600" />
                ) : (
                  <MdCheckBoxOutlineBlank size={22} color="#000" />
                )}
              </div>
              <span className={classItemText}>{i}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
