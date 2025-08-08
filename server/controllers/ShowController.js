import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

//API  to get now playing movies from TMD API
export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}` }
        })

        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}


export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId);
        if (!movie) {
            // 1️⃣ Get movie details using v3 API key in query
            const movieDetailResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}`, // Your Read Access Token
                    },
                }
            );

            console.log(movieDetailResponse.data);

            // 2️⃣ Get credits using v4 token in Authorization header
            const moviesCreditsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}`
                    }
                }
            );

            const movieApiData = movieDetailResponse.data;
            const movieCreditsData = moviesCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast, // TMDB key is `cast`
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            };

            movie = await Movie.create(movieDetails);
        }

        // Create shows for each date/time
        const showToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;
                showToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showToCreate.length > 0) {
            await Show.insertMany(showToCreate);
        }

        res.json({ success: true, message: "Show added successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        const uniqueshow = new Set(shows.map(show => show.movie))

        res.json({ success: true, shows: Array.from(uniqueshow) })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })

        const movie = await Movie.findById(movieId);
        const dateTime = {}

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = []
            }

            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })
        res.json({ success: true, movie, dateTime })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export default getNowPlayingMovies