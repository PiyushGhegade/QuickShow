import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";


export const isAdmin = async(req,res) => {
    res.json({success: true, isAdmin: true});
}

export const getDashboard = async(req,res) => {
    try {
        const bookings = await Booking.find({isPaid:true});
        const activeShow = await Show.find({showDateTime:{$gte: new Date()}}).populate('movie');
        const totaluser = await User.countDocuments()

        const dashboradData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount,0),
            activeShow,
            totaluser
        }

        res.json({success:true, dashboradData})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export const getallshows = async(req,res)=>{
    try {
        const shows = await Show.find({showDateTime : {$gte: new Date()}}).populate('movie').sort({showDateTime:1})

        res.json({success:true, shows})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export const getallbookings = async(req,res)=>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate: {path: "movie"}
        }).sort({cratedAt: -1})

        res.json({success:true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}


