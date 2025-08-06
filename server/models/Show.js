import mongoose, { mongo } from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {type: String, require:true, ref: 'Movie'},
        showDateTime: {type:Date,required: true},
        showPrice: {type: Number, require:true},
        occupiedSeats: {type: Object, default:{}}
    },{minimize:false}
)

const Show=mongoose.model("Show",showSchema);

export default Show;