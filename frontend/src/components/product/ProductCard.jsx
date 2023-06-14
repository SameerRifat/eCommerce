import React from 'react'
import { NavLink } from 'react-router-dom'
import Rating from '@mui/material/Rating';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const ProductCard = ({ product }) => {
    const { _id, name, description, price, ratings, images, category, stock, numOfReviews, } = product
    const options = {
        size: "medium",
        value: ratings,
        readOnly: true,
        precision: 0.5
    }
    return (
        <NavLink to={`/product/${_id}`} className='shadow-md pb-3 rounded-lg bg-white'>
            <div key={product.id} className="group relative">
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg lg:aspect-none group-hover:opacity-75 lg:h-72">
                    <img
                        src={images[0].url}
                        alt={name}
                        className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                    />
                </div>
                <div className='mt-4 px-3 flex flex-col gap-1'>
                    <h3 className="text-base font-semibold text-gray-700">
                        {name}
                    </h3>
                    <div className='flex items-center gap-2'>
                        <Rating {...options}></Rating>
                        <span className='text-sm text-gray-600'>({numOfReviews}) reviews</span>
                    </div>
                    <p className="text-base font-semibold text-orange-500">{`Rs. ${price}`}</p>
                </div>
                {/* <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        {name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
            </div> */}
            </div>
        </NavLink>
    )
}

export default ProductCard