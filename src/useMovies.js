import { useState,useEffect } from "react";

const Key="cb7cddbf"




export function useMovies(query,callback){


  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading]=useState(false)



    useEffect(function() {
        // callback?.()

        const controller=new AbortController()
    
        async function FetchMovies(){
    
          try{
        setIsLoading(true);
        const res= await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${Key}&s=${query}`,{signal:controller.signal});
        const data= await res.json();
        if(!res.ok) throw new Error("Oops!, Something went wrong, Try again!")
        setMovies(data.Search)
      setIsLoading(false)
      // console.log(data.Search)
    }catch(err){
      console.log(err)
    }
        } 
        if(!query.length<3){
          setMovies([])
        }
        
        FetchMovies()
        
        
        
      }, [query])

      return {movies, isLoading}
}