import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        _id: {type: String, require: true},
        title: {type: String, require: true},
        overview: {type: String, require: true},
        poster_path: {type: String, require: true},
        backdrop_path: {type: String, require: true},
        release_date: {type: String, require: true},
        orignal_language: {type: String},
        tagline: {type: String},
        genres: {type: Array, required: true},
        casts: {type: Array, required: true},
        vote_average: {type: Number, required: true},
        run_time: {type: Number, required: true},
    },{timestamps: true}
)

const Movie = mongoose.model('Movie', movieSchema)

export default Movie