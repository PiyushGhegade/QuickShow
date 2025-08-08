import express from 'express';
import { createBooking, getoccupiedSeat } from '../controllers/bookingController.js';


const bookingRouter = express.Router();


bookingRouter.post('/create', createBooking);
bookingRouter.get('/seat', getoccupiedSeat);


export default bookingRouter;
