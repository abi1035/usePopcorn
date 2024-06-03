import { useState,useEffect } from "react";

export function useStorage(initialState, key){
    const [value, setValue] = useState(function(){
        const storedMovies=localStorage.getItem(key)
        return storedMovies ? JSON.parse(storedMovies) : initialState;

      });

      useEffect(function(){
        localStorage.setItem(`key`, JSON.stringify(key))
      
        },[value, key])

        return[value,setValue]
}