import Booking from "../models/Booking.js";
import Show from "../models/Show.js"


const checkSeatAvailability = async(showId, selectedSeats) => {
    try {
        const ShowData = await Show.findById(showId);
        if(!ShowData) return false;

        const occupiedSeats = ShowData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error)
        return false
    }
}


export const createBooking = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body();
        const {origin} = req.headers;

        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available"})
        }

        const ShowData = Show.findById(showId).populate('movie');

        const booking = await Booking.create({
            user: {userId},
            show: showId,
            amount: ShowData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        })

        selectedSeats.map((seat) => {
            ShowData.occupiedSeats[seat] = userId
        })

        ShowData.markModified('occupiedSeats')

        await ShowData.save()

        // stripe Gateway Initialize

        res.json({success: true, message: 'Booked successfully'})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }
}


export const getoccupiedSeat = async(req,res) => {

    try {
        
        const {showId} = req.params;
        showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success:true, occupiedSeats})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }

}