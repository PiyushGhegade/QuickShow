import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/dateFormat';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () =>{
    setbookings(dummyBookingData)
    setLoading(false)
  }
  
  useEffect(() => {
    getAllBookings()
  },[])

  return !loading ? (
    <>  
      <Title text1="List" text2="Bookigs"/>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-[var(--color-primary)]/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium '>Movies Name</th>
              <th className='p-2 font-medium '>Show Time</th>
              <th className='p-2 font-medium '>Seats</th>
              <th className='p-2 font-medium '>Amount</th>
            </tr>
          </thead>

          <tbody className='text-sm font-light'>
            {bookings.map((items,index) => (
              <tr key={index} className='border-b border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 even:bg-[var(--color-primary)]/10'>
                <td className='p-2 min-w-45 pl-5'>{items.user.name}</td>
                <td className='p-2 '>{items.show.movie.title}</td>
                <td className='p-2 '>{dateFormat(items.show.showDateTime)}</td>
                <td className='p-2 '>{Object.keys(items.bookedSeats).map(seat => items.bookedSeats[seat]).join(", ")}</td>
                <td className='p-2 '>{currency} {items.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ): <Loading/>
}

export default ListBookings