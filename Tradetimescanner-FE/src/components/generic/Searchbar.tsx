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
      className={`text-gray-500 px-4 py-2.5 bg-white flex w-full max-w-[320px] items-center border-2 ${
        focus ? "border-primary shadow-lg shadow-primary/10" : "border-gray-200 hover:border-gray-300 shadow-sm"
      } rounded-xl transition-all duration-200 ${style}`}
    >
      <FiSearch className={`flex-shrink-0 transition-colors duration-200 ${focus ? "text-primary" : "text-gray-400"}`} size={16} />
      <input
        className="outline-none border-none text-sm mx-2.5 w-full text-gray-700 placeholder-gray-400 bg-transparent"
        placeholder={placeholder ? placeholder : "Search"}
        onFocus={(_) => setfocus(true)}
        onBlur={(_) => setfocus(false)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
export default Searchbar;
