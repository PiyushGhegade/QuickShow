import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

//API  to get now playing movies from TMD API
export const getNowPlayingMovies = async (req,res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results;
        res.json({success:true,movies:movies})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

export const addShow = async (req,res) => {
    try {
        const {movieId, showsInput, showPrice} = req.body
        
        let movie = await movie.findById(movieId)

        if(!movie){
            //Fetch movie details and credits from TMDB API
            const [movieDetailResponse,moviesCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}}),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
                headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}})
            ]);

            const movieApiData = movieDetailResponse.data;
            const movieCreditsData = moviesCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                paster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: moviesCreditsResponse.casts,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }

            movie = await Movie.create(movieDetails)
        }

        const showToCreate = [];
        showsInput.forEach(show =>{
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        })

        if(showToCreate.length > 0){
            await Show.insertMany(showToCreate);
        }

        res.json({success:true , message:"Show Add Successfully."})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

export const getShows = async(req,res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movies').sort({showDateTime:1});
        const uniqueshow = new Set(show.map(show => show.movie))

        res.json({success:true, shows:Array.from(uniqueshow)})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

export default getNowPlayingMovies