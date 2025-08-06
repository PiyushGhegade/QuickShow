import express from 'express';
import getNowPlayingMovies, { addShow } from '../controllers/ShowController.js';
import { protectAdmin } from '../middleware/auth.js';


const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin, getNowPlayingMovies)
showRouter.post('/add',protectAdmin,addShow)

export default showRouter