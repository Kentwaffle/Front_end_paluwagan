import React from 'react'
import PaluwaganMain from '../LandingPage/paluwaganMain'
import { Link } from 'react-router-dom'

function Eror404() {
  return (
    <div className='w-screen p-5 pt-20 flex flex-col gap-3 items-center justify-center'>
        <h1 className='text-6xl font-bold text-red-500'>404 not found</h1>
        <p className='text-lg'>Whoops! It looks like this page is missing from our map. Don't worry, you don't need a rescue mission. Just click the button below to find your way back to the Palugawan Home Page and continue browsing our loan services.</p>
        <Link to="/" className='mt-6'>
            <button className='btn btn-soft px-8 py-3 bg-sky-400 font-semibold rounded-md shadow-sm hover:bg-sky-500 transition duration-300'>
                Redirect to homepage
            </button>
        </Link>
    </div>
  )
}

export default Eror404
