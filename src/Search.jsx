import { useRef, useEffect } from "react";
import { useKey } from "./useKey";

export function Search({ setQuery, query }) {


  const inputElement=useRef(null);

  useKey("Enter",function(){
    if(document.activeElement===inputElement.current) return;
  
    (inputElement.current.focus())
  setQuery("")
  })



  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputElement} />
    </div>
  );
}
