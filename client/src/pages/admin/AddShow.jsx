import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { StarIcon } from 'lucide-react'

const AddShow = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [nowPlayingMovies, setnowPlayingMovies] = useState([])
  const [selectedMovies, setselectedMovies] = useState(null)
  const [DateTimeSelection, setDateTimeSelection] = useState({})
  const [DateTimeInput, setDateTimeInput] = useState({})
  const [showPrice, setshowPrice] = useState({})

  const fetchNowPlayingMovies = async () => {
    setnowPlayingMovies(dummyShowsData)
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  },[])

  return nowPlayingMovies.length > 0 ?(
    <>
      <Title text1="Add" text2="Shows"/>
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pd-4'>
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movies) => (
            <div key={movies.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}>
              <div className='relative rounded-lg overflow-hidden'>
                <img src={movies.poster_path} alt=""  className='w-full object-cover brightness-90'/>
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                <p className='flex items-center gap-1 text-gray-400'>
                  <StarIcon className='w-4 h-4 text-[var(--color-primary)]'/>
                  {movies.vote_average}
                </p>
                <p className='text-gray-300'>{movies.vote_count.toFixed(1)}  Votes</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  ): <Loading/>
}

export default AddShow