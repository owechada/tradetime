import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchbarPropDTO {
  onChange: (value: string) => void;
  placeholder?: string;
  style?:string;
}
const Searchbar: React.FC<SearchbarPropDTO> = ({
  onChange,
  placeholder,
  style
}: SearchbarPropDTO) => {
  const [focus, setfocus] = useState(false);
  return (
    <div
      className={` text-nuetral400 px-3 py-2 bg-white flex w-[300px] max-h-[40px] items-center  border-[3px] shadow ${
        focus ? "outline-nuetral600 outline-[3px] outline" : ""
      }  border-primary200 border-solid rounded-[10px]  ${style}`} 
    >
      <FiSearch className="inline  " />
      <input
        className="outline-none border-none text-sm mx-2 w-full text-nuetral400 "
        placeholder={placeholder ? placeholder : "Search"}
        onFocus={(_) => setfocus(true)}
        onBlur={(_) => setfocus(false)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
export default Searchbar;
