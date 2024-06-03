import { useState, useEffect } from "react";
// import StarRating from './StarRating'
import { Search } from "./Search";
import { Logo } from "./Logo";
import { useMovies } from "./useMovies";
import { useStorage } from "./useStorage";
import { useKey } from "./useKey";
const Key="cb7cddbf"





const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({children}){

return(<div>

  <nav className="nav-bar">
    {children}
      </nav>
</div>)
}

function ResultsFound({movies}){
  return(
    <div>
      <p className="num-results">
          Found <strong>{movies && movies.length}</strong> results
        </p>
    </div>
  )
}

export default function App() {
  
  
  const [selectedId,setSelectedId]=useState(null)
  const [query, setQuery] = useState([]);


  const [watched,setWatched]=useStorage([],"watched")


  const {movies,isLoading}=useMovies(query,handleCloseMovie)

  function handleSelect(id){
    setSelectedId(selectedId=> selectedId==id ? null : id)
  }

  function handleCloseMovie(){
    setSelectedId(null)
  }


  

  


function handleWatch(movie){

  
  setWatched(watched=>[...watched, movie])
  

}

function handleDelete(id){
  setWatched((watched)=>watched.filter(movie=>movie.imdbID!==id))
}
  


  

  return (
    <>
      <NavBar>
        <Logo/>
      {/* <StarRating/> */}

        <Search query={query} setQuery={setQuery}/>
      <ResultsFound movies={movies}/> 
      </NavBar>
      <Main>
        <Box >
          {isLoading ? <Loader/> : <MovieList movies={movies} onSelectMovie={handleSelect}/>}
        </Box>

      <Box>
      {selectedId ? <MovieDetail selectedId={selectedId} handleCloseMovie={handleCloseMovie} onAddWatch={handleWatch} watched={watched}/> : 
      <><WatchedSummary watched={watched}/> <WatchedList watched={watched} onDelete={handleDelete}/></>}
      </Box>

      </Main>
        

    </>
  );
}

function Loader(){
  return (<p className="loader">Loading...</p>)
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);


  return(
    <div>
      <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && children}
        </div>
    </div>
  )
}

function MovieList({movies, onSelectMovie}){
  return(
    <div>
      <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} key={movie} onSelectMovie={onSelectMovie}/>
                
              ))}
            </ul>
    </div>
  )
}

function MovieDetail({selectedId, handleCloseMovie, onAddWatch, watched}){
  
const [movie, setMovie]=useState({})
const [isLoading, setIsLoading]=useState(false)

const isWatched=watched.map((movie)=>movie.imdbID).includes(selectedId)
// console.log(isWatched)


const {
  Title:title, 
  Year:year, 
  Poster:poster,
  Runtime:runtime,
  imdbRating,
  Plot:plot,
  Released:released,
Actors:actors,
 Director:director, 
 Genre:genre}=movie

 function handleAdd(){
  const newWatchedMovie={
    imdbID:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),

  }

  


  onAddWatch(newWatchedMovie);
  handleCloseMovie();
 }

  useKey("Escape", handleCloseMovie)

//  useEffect(function(){ function callback(e){
//     if(e.code=="Escape"){
//       handleCloseMovie()
//     }H
//   document.addEventListener('keydown', callback() )  
    
//     return function(){
//       document.removeEventListener('keydown', callback())
//     }}
// },[handleCloseMovie])
  
  useEffect(function(){
    async function getMovieDetails(){
      setIsLoading(true)
      const res=await fetch(`http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`)
      const data= await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()

  },[selectedId])


  useEffect(function(){
    if(!title) return
    document.title=`Movie: ${title}`
    return function(){
      document.title="UsePopcorn"
    }


  },[title])

  return(

  <div className="details">
    {isLoading ? <Loader/> : <>  <header>
<button className="btn-back" onClick={()=>handleCloseMovie()}>&larr;</button>

<img src={poster} alt={`Poster of ${title}`}/>

<div className="details-overview">
<h2>{title}</h2>
<p>{released} &bull; {runtime}</p>
<p>{genre}</p>
<p>IMDB rating: {imdbRating} <span>⭐</span></p>


  </div>
  </header>
  <section>
  <div className="rating">
  {/* <StarRating maxRating={10} size={24}/> */}

  {!isWatched ? <button className="btn-add" onClick={handleAdd}>+ Add To List</button> : <p>Movie is already on the List</p>}
  </div>
    <p><em>{plot}</em></p>
    <p>Starring: {actors}</p>
    <p>Directed by: {director}</p>
  </section>
  </>}

    </div>)
}

function Movie({movie,onSelectMovie}){

  return(
    <div>
      <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
    </div>
  )
}

function Main({children}){

  

  return(
    <div>
            <main className="main">
        {children}
        

       
      </main>
    </div>
  )
}


// function WatchBox(){
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);


//   return(
//     <div>
//        <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && ( 
//             <>
//             <WatchedSummary watched={watched}/>
//             <WatchedList watched={watched}/>
              
//             </>
//           )}
//         </div>
//     </div>
//   )
// }

function WatchedList({watched, onDelete}){

  return(
    <div>
      <ul className="list">
                {watched.map((movie) => (
                  <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      {/* <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p> */}
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>

                      <button className="btn-delete" onClick={()=>onDelete(movie.imdbID)}>X</button>
                    </div>
                  </li>
                ))}
              </ul>
    </div>
  )
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  // const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
    <div>
      <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                  </p>
                  {/* <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p> */}
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
    </div>
  )
}