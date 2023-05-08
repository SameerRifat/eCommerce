import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NavLink } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
        <CheckCircleIcon style={{color: 'tomato', fontSize: '50px', marginBottom: '5px'}}/>
        <p>Your order has been placed successfully</p>
        <NavLink to="/orders" className='bg-[rgb(51,51,51)] text-white mt-3 py-2.5 px-5'>View Orders</NavLink>
    </div>
  )
}


export default OrderSuccess