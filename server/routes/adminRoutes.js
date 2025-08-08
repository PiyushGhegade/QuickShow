import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import { getallbookings, getallshows, getDashboard, isAdmin } from '../controllers/adminController.js';



const adminRouter = express.Router();


adminRouter.get('/is-admin',protectAdmin,isAdmin);
adminRouter.get('/dashboard',protectAdmin,getDashboard);
adminRouter.get('/all-shows',protectAdmin,getallshows);
adminRouter.get('/all-bookings',protectAdmin,getallbookings);


export default adminRouter;
